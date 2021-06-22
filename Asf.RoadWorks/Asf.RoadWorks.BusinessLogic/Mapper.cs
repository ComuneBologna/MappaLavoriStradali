using Asf.RoadWorks.BusinessLogic.Models;
using Asf.RoadWorks.DataAccessLayer.Entities;
using SmartTech.Infrastructure.Search;
using System.Collections.Generic;
using System.Linq;

namespace Asf.RoadWorks.BusinessLogic
{
    public static class Mapper
    {
        public static IEnumerable<SortCriteria<ImportLogEntity>> MapImportLogEntityOC(this ImportLogsSearchCriteria criteria)
        {
            var ret = new List<SortCriteria<ImportLogEntity>>();
            ret.Add(new SortCriteria<ImportLogEntity>()
            {
                Ascending = criteria.Ascending,
                KeySelector = criteria.KeySelector switch
                {
                    nameof(ImportLogRead.CompanyId) => x => x.CompanyId,
                    nameof(ImportLogRead.LogFileName) => x => x.LogFileName,
                    nameof(ImportLogRead.LogFilePath) => x => x.LogFilePath,
                    nameof(ImportLogRead.MigrationDate) => x => x.MigrationDate,
                    _ => x => x.Id
                }
            });
            return ret;
        }
        public static FilterCriteria<CompanyEntity> MapCompanyOC(this CompanySearchCriteria sc) =>

            new FilterCriteria<CompanyEntity>
            {
                ItemsPerPage = sc.ItemsPerPage,
                PageNumber = sc.PageNumber,
                SortCriterias = new List<SortCriteria<CompanyEntity>>(){new SortCriteria<CompanyEntity>(){
                    Ascending = sc.Ascending,
                    KeySelector = sc.KeySelector switch
                    {
                        nameof(Company.IsOperationalUnit) => x => x.IsOperationalUnit,
                        nameof(Company.Name) => x => x.Name,
                        _ => x => x.Id
                    }
                }}
            };

        public static IEnumerable<SortCriteria<RoadWorkEntity>> MapRoadWorkOC(this RoadWorksSearchCriteria orderCriteria)
        {
            var ret = new List<SortCriteria<RoadWorkEntity>>();
            ret.Add(new SortCriteria<RoadWorkEntity>()
            {
                Ascending = orderCriteria.Ascending,
                KeySelector = orderCriteria.KeySelector switch
                {
                    nameof(RoadWork.Address) => x => x.Address,
                    nameof(RoadWork.AddressNumberFrom) => x => x.AddressNumberFrom,
                    nameof(RoadWork.AddressNumberTo) => x => x.AddressNumberTo,
                    nameof(RoadWork.Category) => x => x.Category,
                    nameof(RoadWork.CompanyId) => x => x.Company.Id,
                    nameof(RoadWork.CompanyName) => x => x.Company.Name,
                    nameof(RoadWork.Priority) => x => x.Priority,
                    nameof(RoadWork.Status) => x => x.Status,
                    nameof(RoadWork.Year) => x => x.Year,
                    _ => x => x.Id
                }
            });
            return ret;
        }

        public static FilterCriteria<RoadwayEntity> MapRoadwayOC(this RoadwaysSearchCriteria sc) {
            return new FilterCriteria<RoadwayEntity>
            {
                PageNumber = sc.PageNumber,
                ItemsPerPage = sc.ItemsPerPage,
                SortCriterias = new List<SortCriteria<RoadwayEntity>>(){new SortCriteria<RoadwayEntity>(){
                    Ascending = sc.Ascending,
                    KeySelector = sc.KeySelector switch
                    {
                        nameof(Roadway.Name) => x => x.Name,
                        _ => x => x.Id
                    }
                }}
            };
        }

        public static FilterCriteria<RoadWorkAttachmentEntity> MapRoadWorkAttachmentOC(this AttachmentsSearchCriteria sc) =>
            new FilterCriteria<RoadWorkAttachmentEntity>
            {
                PageNumber = sc.PageNumber,
                ItemsPerPage = sc.ItemsPerPage,
                SortCriterias = new List<SortCriteria<RoadWorkAttachmentEntity>>(){new SortCriteria<RoadWorkAttachmentEntity>(){
                    Ascending = sc.Ascending,
                    KeySelector = sc.KeySelector switch
                    {
                        nameof(RoadWorkAttachmentInfo.Name) => x => x.Name,
                        nameof(RoadWorkAttachmentInfo.IsPublic) => x => x.IsPublic,
                        nameof(RoadWorkAttachmentInfo.ContentType) => x => x.ContentType,
                        _ => x => x.Id
                    }
                }}
            };

        public static FilterCriteria<ConfigurationEntity> MapRoadWorkConfigurationOC(this ConfigurationSearchCriteria sc) =>

            new FilterCriteria<ConfigurationEntity>
            {
                PageNumber = sc.PageNumber,
                ItemsPerPage = sc.ItemsPerPage,
                SortCriterias = new List<SortCriteria<ConfigurationEntity>>(){new SortCriteria<ConfigurationEntity>(){
                    Ascending = sc.Ascending,
                    KeySelector = sc.KeySelector switch
                    {
                        nameof(Configuration.SubmissionEndDate) => x => x.SubmissionEndDate,
                        nameof(Configuration.SubmissionStartDate) => x => x.SubmissionStartDate,
                        nameof(Configuration.Year) => x => x.Year,
                        _ => x => x.Id
                    }
                }}
            };
    }
}