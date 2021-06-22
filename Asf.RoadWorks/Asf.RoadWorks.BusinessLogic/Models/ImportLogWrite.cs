using Asf.RoadWorks.BusinessLogic.Localization;
using SmartTech.Infrastructure.Validations;
using System;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class ImportLogWrite
	{
		[Required]
		[Label(ResourcesConst.CompanyId)]
		public long? CompanyId { get; set; }

		[Required]
		[Label(ResourcesConst.MigrationDate)]
		public DateTime? MigrationDate { get; set; }

		[Required]
		[Label(ResourcesConst.LogFilePath)]
		public string LogFilePath { get; set; }

		[Required]
		[Label(ResourcesConst.LogFileName)]
		public string LogFileName { get; set; }
	}
}