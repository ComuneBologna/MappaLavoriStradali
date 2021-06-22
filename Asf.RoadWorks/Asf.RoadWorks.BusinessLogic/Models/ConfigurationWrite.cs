using Asf.RoadWorks.BusinessLogic.Localization;
using SmartTech.Infrastructure.Validations;
using System;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class ConfigurationWrite
	{
		[Required]
		[RangeNumber(1900, 9999)]
		[Label(ResourcesConst.Year)]
		public short? Year { get; set; }

		[Required]
		[Label(ResourcesConst.SubmissionStartDate)]
		public DateTime? SubmissionStartDate { get; set; }

		[Required]
		[Label(ResourcesConst.SubmissionEndDate)]
		public DateTime? SubmissionEndDate { get; set; }
	}
}