import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AgencyBasicInfoDto,
  AgencyBasicInfoSearchQueryDto,
  AgencyBasicInfoSearchResultDto,
  AgencyQueryDto,
  AgencyQueryResultDto,
  CommentDto,
  UserDto,
} from '../dtos/agency.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class AgencyService {
  constructor(private prismaService: PrismaService) {}

  logger = new Logger('AgencyService');

  async searchForAgencies(
    agencySearchQuery: AgencyBasicInfoSearchQueryDto,
  ): Promise<AgencyBasicInfoSearchResultDto> {
    const agencies = await this.prismaService.agency.findMany({
      where: {
        name: {
          contains: agencySearchQuery.name,
          mode: 'insensitive',
        },
        location: {
          address: {
            contains: agencySearchQuery.adress,
            mode: 'insensitive',
          },
        },
        user: {
          approved: true,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        user: {
          select: {
            image: true,
          },
        },
        location: {
          select: {
            address: true,
          },
        },
      },
      orderBy: [
        {
          name: agencySearchQuery.sortNameAsc ? 'asc' : 'desc',
        },
        {
          location: {
            address: agencySearchQuery.sortAdressAsc ? 'asc' : 'desc',
          },
        },
      ],
    });
    this.logger.log('Agencies found: ', agencies);
    const agencyDtos = agencies.map((agency) => {
      return new AgencyBasicInfoDto(
        agency.id,
        agency.name,
        agency.user.image,
        agency.description,
        agency.location.address,
      );
    });
    return new AgencyBasicInfoSearchResultDto(agencyDtos);
  }

  async getAgency(agencyQuery: AgencyQueryDto): Promise<AgencyQueryResultDto> {
    const agency = await this.prismaService.agency.findUnique({
      where: {
        id: agencyQuery.id,
      },
      include: {
        location: true,
        comments: {
          include: {
            client: {
              include: {
                user: true,
              },
            },
          },
        },
        user: true,
      },
    });
    const commentDtos = agency.comments.map((comment) => {
      if (agencyQuery.depersonalized) {
        return new CommentDto(
          comment.id,
          comment.text,
          comment.rating,
          new UserDto(
            comment.client.user.id,
            'Anonymous',
            comment.client.user.image,
          ),
        );
      }
      return new CommentDto(
        comment.id,
        comment.text,
        comment.rating,
        new UserDto(
          comment.client.user.id,
          comment.client.user.username,
          comment.client.user.image,
        ),
      );
    });
    return {
      id: agency.id,
      name: agency.name,
      description: agency.description,
      address: agency.location.address,
      city: agency.location.city,
      uniqueCode: agency.uniqueCode,
      country: agency.location.country,
      comments: commentDtos,
      image: agency.user.image,
    };
  }
}
