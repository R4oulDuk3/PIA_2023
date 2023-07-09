import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Konva from 'konva';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AppState } from 'src/app/state/app.state';
import { username } from 'src/app/state/auth/auth.selectors';
import {
  GetObjectForUserResultDto,
  UpsertObjectDto,
} from '../../dtos/object.dto';
import { ObjectService } from '../../services/object.service';
import { parse } from 'path';
import { catchError } from 'rxjs';
@Component({
  selector: 'app-object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.scss'],
})
export class ObjectEditorComponent implements OnInit, AfterViewInit {
  @ViewChild('stageContainer', { static: true }) stageContainer: ElementRef;
  @ViewChild('roomsTable') roomsTable: MatTable<any>;
  @ViewChild('doorsTable') doorsTable: MatTable<any>;
  CANVAS_DIMENSIONS = {
    width: 400,
    height: 400,
  };
  displayedColumns: string[] = ['X', 'Y', 'width', 'height', 'actions'];
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  roomRectangles: Konva.Rect[] = [];
  doorRectangles: Konva.Rect[] = [];
  elements: any[] = [];
  drawingMode: string = DrawingMode.ROOM.toString();
  doorDrawingMode: string = DoorDrawingMode.HORIZONTAL.toString();
  objectValid = false;
  buildingForm: FormGroup;
  roomForm: FormGroup;
  objectId: string | null = null;
  clientUsername: string | null = null;
  selectedFileName = '';
  constructor(
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private objectService: ObjectService,
    private router: Router
  ) {
    this.buildingForm = this.fb.group({
      objectType: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  initializeRoomForm() {
    this.roomForm = this.fb.group({
      width: [50, [Validators.required, Validators.min(0)]],
      height: [50, [Validators.required, Validators.min(0)]],
    });
  }
  ngOnInit(): void {
    this.initializeRoomForm();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.objectId = params['id'];
      }
      if (this.objectId)
        this.objectService.getObjectForUser(parseInt(this.objectId)).subscribe({
          next: (data: GetObjectForUserResultDto) => {
            this.initializeStateFromDto(data);
          },
          error: (err) => {
            this.snackbar.showSnackbar(err.error.message);
          },
        });
    });

    this.store.select(username).subscribe((data) => {
      this.clientUsername = data;
    });
  }

  resetState() {
    this.roomRectangles = [];
    this.doorRectangles = [];
    this.elements = [];
    this.drawingMode = DrawingMode.ROOM.toString();
    this.doorDrawingMode = DoorDrawingMode.HORIZONTAL.toString();
    this.objectValid = false;
    this.buildingForm.reset();
  }

  initializeStateFromDto(object: GetObjectForUserResultDto) {
    this.resetState();
    console.log(object);
    this.buildingForm.get('objectType')?.setValue(object.type);
    this.buildingForm.get('address')?.setValue(object.address);
    this.buildingForm.get('city')?.setValue(object.city);
    this.buildingForm.get('country')?.setValue(object.country);
    this.roomRectangles = object.rooms.map((room) => {
      return new Konva.Rect({
        x: room.cordX,
        y: room.cordY,
        width: room.width,
        height: room.height,
        stroke: 'black',
        draggable: true,
      });
    });
    this.doorRectangles = object.doors.map((door) => {
      return new Konva.Rect({
        x: door.cordX,
        y: door.cordY,
        width: door.width,
        height: door.height,
        stroke: 'black',
        draggable: false,
      });
    });
    this.roomRectangles.forEach((rect) => this.layer.add(rect));
    this.doorRectangles.forEach((rect) => this.layer.add(rect));
    this.checkObjectValidity();
    this.layer.draw();
    this.objectValid = true;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          console.log('Success! JSON data:', jsonData);
          this.initializeFromJson(e.target.result);
        } catch (error) {
          console.log('Invalid JSON format:', error);
          this.snackbar.showSnackbar('Invalid JSON format');
        }
      };

      reader.readAsText(file);
    }
  }

  initializeFromJson(json: string) {
    const object = JSON.parse(json);
    try {
      this.initializeStateFromDto(object);
    } catch (error) {
      this.snackbar.showSnackbar('Invalid JSON format');
    }
  }

  ngAfterViewInit(): void {
    this.stage = new Konva.Stage({
      container: this.stageContainer.nativeElement,
      width: 400,
      height: 400,
    });

    this.layer = new Konva.Layer();

    this.stage.add(this.layer);
    this.addEventListeners();
  }

  confirmObject() {
    const id = this.objectId;
    const objectType = this.buildingForm.get('objectType')?.value;
    const address = this.buildingForm.get('address')?.value;
    const city = this.buildingForm.get('city')?.value;
    const country = this.buildingForm.get('country')?.value;
    const rooms = this.roomRectangles.map((rect) => {
      return {
        cordX: rect.x(),
        cordY: rect.y(),
        width: rect.width(),
        height: rect.height(),
      };
    });
    const doors = this.doorRectangles.map((rect) => {
      return {
        cordX: rect.x(),
        cordY: rect.y(),
        width: rect.width(),
        height: rect.height(),
      };
    });
    const upsertObjectDto: UpsertObjectDto = {
      id: id == undefined ? undefined : parseInt(id),
      type: objectType,
      address: address,
      city: city,
      country: country,
      upsertChartObjectDto: {
        rooms: rooms,
        doors: doors,
      },
      username: this.clientUsername!,
    };
    this.objectService.upsertObject(upsertObjectDto).subscribe({
      next: (data) => {
        this.snackbar.showSnackbar('Object saved!');
        this.router.navigate(['/object/list']);
      },
      error: (err) => {
        console.log(err);
        this.snackbar.showSnackbar('Failed to save object!');
      },
    });
  }

  deleteRoom(elemenet: Konva.Rect) {
    this.roomRectangles = this.roomRectangles.filter(
      (item) => item !== elemenet
    );
    this.checkObjectValidity();
    this.roomsTable.renderRows();
    elemenet.destroy();
  }

  deleteDoor(door: Konva.Rect) {
    this.doorRectangles = this.doorRectangles.filter((item) => item !== door);
    // this.markValidRectangles(this.doorRectangles);
    this.doorsTable.renderRows();
    door.destroy();
  }

  updateDrawingMode(mode: string) {
    this.drawingMode = mode;
    if (this.drawingMode === DrawingMode.DOOR.toString()) {
      this.roomRectangles.forEach((rect) => {
        rect.draggable(false);
      });
    } else if (this.drawingMode === DrawingMode.ROOM.toString()) {
      this.roomRectangles.forEach((rect) => {
        rect.draggable(true);
      });
    }
  }
  toggleDoorDrawingMode() {
    if (this.doorDrawingMode === DoorDrawingMode.HORIZONTAL.toString()) {
      this.doorDrawingMode = DoorDrawingMode.VERTICAL.toString();
    } else {
      this.doorDrawingMode = DoorDrawingMode.HORIZONTAL.toString();
    }
  }

  checkIfRoomIsInsideBuilding(room: Konva.Rect): boolean {
    const roomWidth = room.width();
    const roomHeight = room.height();
    const roomX = room.x();
    const roomY = room.y();

    const buildingWidth = this.CANVAS_DIMENSIONS.width;
    const buildingHeight = this.CANVAS_DIMENSIONS.height;
    if (
      roomX + roomWidth > buildingWidth ||
      roomY + roomHeight > buildingHeight ||
      roomX < 0 ||
      roomY < 0
    ) {
      return false;
    }
    return true;
  }

  checkObjectValidity(): void {
    const formValid = this.buildingForm.valid;
    const roomsValid = this.checkRoomRectanglesValidity();
    const doorsValid = this.checkDoorRectanglesValidity();
    console.log(
      `roomsValid: ${roomsValid}  doorsValid: ${doorsValid} formValid: ${formValid}`
    );
    this.objectValid = roomsValid && doorsValid && formValid;
  }

  checkDoorRectanglesValidity(): boolean {
    let validDoorsCount = 0;
    this.doorRectangles.forEach((rect) => {
      const isOverlap = checkLineIntersection(this.roomRectangles, rect);

      rect.fill(isOverlap ? 'green' : 'brown');
      if (isOverlap) {
        validDoorsCount++;
      }
    });

    return validDoorsCount == this.doorRectangles.length && validDoorsCount > 0;
  }

  checkRoomRectanglesValidity(): boolean {
    let validRoomsCount = 0;
    this.roomRectangles.forEach((rect) => {
      const isOverlap = this.roomRectangles.some((otherRect) => {
        return (
          rect !== otherRect &&
          checkIntersection(rect.getClientRect(), otherRect.getClientRect(), 0)
        );
      });

      rect.stroke(
        (isOverlap || this.roomRectangles.length === 1) &&
          this.checkIfRoomIsInsideBuilding(rect)
          ? 'green'
          : 'black'
      );
      if (
        (isOverlap || this.roomRectangles.length === 1) &&
        this.checkIfRoomIsInsideBuilding(rect)
      ) {
        validRoomsCount++;
      }
    });
    this.stage.batchDraw();
    return (
      validRoomsCount === this.roomRectangles.length && validRoomsCount > 0
    );
  }

  getRoomWidthAndHeightFromForm() {
    if (this.roomForm.invalid) {
      this.snackbar.showSnackbar('Invalid room width or height');
      return { width: -1, height: -1 };
    }
    const width = this.roomForm.get('width')?.value;
    const height = this.roomForm.get('height')?.value;
    return { width, height };
  }

  private addEventListeners(): void {
    let isDragging = false;
    let selectedRect: Konva.Rect | null = null;
    let previousPosition: Konva.Vector2d | null = null;

    this.stage.on('mousedown touchstart', (e) => {
      if (this.drawingMode === DrawingMode.ROOM.toString()) {
        const { width, height } = this.getRoomWidthAndHeightFromForm();
        console.log(`width: ${width} height: ${height}`);
        if (e.target === this.stage && this.roomRectangles.length < 3) {
          const pos = this.stage.getPointerPosition();
          if (!pos) return;
          selectedRect = new Konva.Rect({
            x: pos.x,
            y: pos.y,
            width: width,
            height: height,
            stroke: 'black',
            draggable: true,
          });
          const isOverlap = checkLineIntersection(
            this.roomRectangles,
            selectedRect
          );
          if (isOverlap) {
            console.log('Room overlaps with other rooms!');
            this.snackbar.showSnackbar('Room overlaps with other rooms!');
            return;
          }
          const isInside = this.checkIfRoomIsInsideBuilding(selectedRect);
          if (!isInside) {
            console.log('Room is not inside building!');
            this.snackbar.showSnackbar('Room is not inside building!');
            return;
          }

          const containsAnotherRoom = checkForRectangleContainment(
            this.roomRectangles,
            selectedRect
          );
          if (containsAnotherRoom) {
            console.log('Room contains another room!');
            this.snackbar.showSnackbar('Room contains another room!');
            return;
          }

          this.layer.add(selectedRect);
          this.roomRectangles.push(selectedRect);
          this.roomsTable.renderRows();
          this.checkObjectValidity();
          this.stage.batchDraw();
          isDragging = true;
        }
      }
    });

    // this.stage.on('mousemove touchmove', (e) => {
    //   // console.log('mousemove');
    //   if (!isDragging || !selectedRect || this.roomRectangles.length > 2)
    //     return;

    //   const pos = this.stage.getPointerPosition();
    //   if (!pos) return;
    //   const width = pos.x - selectedRect.x();
    //   const height = pos.y - selectedRect.y();
    //   selectedRect.width(width);
    //   selectedRect.height(height);

    //   // Check for rectangle overlap
    //   const isOverlap = this.roomRectangles.some((rect) => {
    //     return (
    //       selectedRect !== rect &&
    //       checkIntersection(selectedRect!.getClientRect(), rect.getClientRect())
    //     );
    //   });

    //   if (isOverlap) {
    //     selectedRect.stroke('red');
    //   } else {
    //     selectedRect.stroke('black');
    //   }

    //   this.stage.batchDraw();
    // });

    this.stage.on('mouseup touchend', () => {
      if (this.drawingMode === DrawingMode.ROOM.toString()) {
        // console.log('mouseup touchend');
        // isDragging = false;
        // if (selectedRect) {
        //   // Check for rectangle overlap
        //   const isOverlap = this.roomRectangles.some((rect) => {
        //     return (
        //       selectedRect !== rect &&
        //       checkIntersection(
        //         selectedRect!.getClientRect(),
        //         rect.getClientRect()
        //       )
        //     );
        //   });
        //   if (isOverlap) {
        //     selectedRect.destroy();
        //   } else if (this.roomRectangles.includes(selectedRect) === false) {
        //     this.roomRectangles.push(selectedRect);
        //     this.roomsTable.renderRows();
        //     console.log(JSON.stringify(this.roomRectangles));
        //   }
        //   this.checkObjectValidity();
        //   this.stage.batchDraw();
        //   selectedRect = null;
        // }
      } else if (this.drawingMode === DrawingMode.DOOR.toString()) {
        const pos = this.stage.getPointerPosition();
        if (!pos) return;
        const door = new Konva.Rect({
          x:
            pos.x -
            (this.doorDrawingMode === DoorDrawingMode.HORIZONTAL.toString()
              ? 7
              : 3),
          y:
            pos.y -
            (this.doorDrawingMode === DoorDrawingMode.HORIZONTAL.toString()
              ? 3
              : 7),
          width:
            this.doorDrawingMode === DoorDrawingMode.HORIZONTAL.toString()
              ? 15
              : 7,
          height:
            this.doorDrawingMode === DoorDrawingMode.HORIZONTAL.toString()
              ? 7
              : 15,
          stroke: 'black',
          fill: 'brown',
          draggable: false,
        });
        this.layer.add(door);
        this.doorRectangles.push(door);
        this.doorsTable.renderRows();
        this.checkObjectValidity();
        this.stage.batchDraw();
      }
    });
    this.stage.on('dragstart', (e) => {
      console.log('dragstart');
      if (e.target instanceof Konva.Rect) {
        console.log('dragstart rect');
        selectedRect = e.target;
        previousPosition = {
          x: selectedRect.x(),
          y: selectedRect.y(),
        };
        isDragging = true;
      }
    });

    this.stage.on('dragmove', (e) => {
      console.log('dragmove');
      if (!isDragging || !selectedRect) return;

      // Check for rectangle overlap
      const isOverlap = this.roomRectangles.some((rect) => {
        return (
          selectedRect !== rect &&
          checkIntersection(selectedRect!.getClientRect(), rect.getClientRect())
        );
      });

      if (isOverlap) {
        selectedRect.position(previousPosition!);
      } else {
        previousPosition = {
          x: selectedRect.x(),
          y: selectedRect.y(),
        };
      }
      this.checkObjectValidity();

      this.stage.batchDraw();
    });

    this.stage.on('dragend', () => {
      console.log('dragend');
      isDragging = false;
      selectedRect = null;
      this.checkObjectValidity();
    });
  }
}
interface Rectangle {
  width: number;
  height: number;
  x: number;
  y: number;
}
function checkIntersection(r1: Rectangle, r2: Rectangle, tolerance = 2) {
  return !(
    r2.x >= r1.x + r1.width - tolerance ||
    r2.x + r2.width <= r1.x + tolerance ||
    r2.y >= r1.y + r1.height - tolerance ||
    r2.y + r2.height <= r1.y + tolerance
  );
}

enum DrawingMode {
  DOOR = 'DOOR',
  ROOM = 'ROOM',
}

enum DoorDrawingMode {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
}

function checkForRectangleContainment(
  otherRectangles: Konva.Rect[],
  currentRectangle: Konva.Rect
): boolean {
  const currentRectX = currentRectangle.x();
  const currentRectY = currentRectangle.y();
  const currentRectWidth = currentRectangle.width();
  const currentRectHeight = currentRectangle.height();

  // Loop through the array of other rectangles
  for (let i = 0; i < otherRectangles.length; i++) {
    const otherRect = otherRectangles[i];

    // Fetch the properties of the other rectangle
    const otherRectX = otherRect.x();
    const otherRectY = otherRect.y();
    const otherRectWidth = otherRect.width();
    const otherRectHeight = otherRect.height();

    // Check if the other rectangle is fully contained within the current rectangle
    if (
      otherRectX >= currentRectX &&
      otherRectY >= currentRectY &&
      otherRectX + otherRectWidth <= currentRectX + currentRectWidth &&
      otherRectY + otherRectHeight <= currentRectY + currentRectHeight
    ) {
      // The other rectangle is fully contained within the current rectangle
      return true;
    }
  }

  // None of the other rectangles are fully contained within the current rectangle
  return false;
}

function checkLineIntersection(
  otherRectangles: Konva.Rect[],
  currentRectangle: Konva.Rect
): boolean {
  function linesIntersect(line1: any, line2: any): boolean {
    console.log(
      `line1: ${JSON.stringify(line1)}, line2: ${JSON.stringify(line2)}`
    );
    const det =
      (line1.endX - line1.startX) * (line2.endY - line2.startY) -
      (line1.endY - line1.startY) * (line2.endX - line2.startX);

    if (det === 0) {
      return false; // lines are parallel
    }

    const lambda =
      ((line2.endY - line2.startY) * (line2.endX - line1.startX) +
        (line2.startX - line2.endX) * (line2.endY - line1.startY)) /
      det;

    const gamma =
      ((line1.startY - line1.endY) * (line2.endX - line1.startX) +
        (line1.endX - line1.startX) * (line2.endY - line1.startY)) /
      det;

    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
  }

  const newRectLines = [
    // top
    {
      startX: currentRectangle.x(),
      startY: currentRectangle.y(),
      endX: currentRectangle.x() + currentRectangle.width(),
      endY: currentRectangle.y(),
    },
    // right
    {
      startX: currentRectangle.x() + currentRectangle.width(),
      startY: currentRectangle.y(),
      endX: currentRectangle.x() + currentRectangle.width(),
      endY: currentRectangle.y() + currentRectangle.height(),
    },
    // bottom
    {
      startX: currentRectangle.x(),
      startY: currentRectangle.y() + currentRectangle.height(),
      endX: currentRectangle.x() + currentRectangle.width(),
      endY: currentRectangle.y() + currentRectangle.height(),
    },
    // left
    {
      startX: currentRectangle.x(),
      startY: currentRectangle.y(),
      endX: currentRectangle.x(),
      endY: currentRectangle.y() + currentRectangle.height(),
    },
  ];

  for (const rect of otherRectangles) {
    const rectLines = [
      // top
      {
        startX: rect.x(),
        startY: rect.y(),
        endX: rect.x() + rect.width(),
        endY: rect.y(),
      },
      // right
      {
        startX: rect.x() + rect.width(),
        startY: rect.y(),
        endX: rect.x() + rect.width(),
        endY: rect.y() + rect.height(),
      },
      // bottom
      {
        startX: rect.x(),
        startY: rect.y() + rect.height(),
        endX: rect.x() + rect.width(),
        endY: rect.y() + rect.height(),
      },
      // left
      {
        startX: rect.x(),
        startY: rect.y(),
        endX: rect.x(),
        endY: rect.y() + rect.height(),
      },
    ];

    for (const newRectLine of newRectLines) {
      for (const rectLine of rectLines) {
        if (linesIntersect(newRectLine, rectLine)) {
          return true;
        }
      }
    }
  }

  return false;
}
