using SmartTech.Infrastructure.Search;
using System;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class ImportLogsSearchCriteria : FilterCriteria
	{
		public long? Id { get; set; }

		public long? CompanyId { get; set; }

		public DateTime? MigrationDate { get; set; }
	}
}