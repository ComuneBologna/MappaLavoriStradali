using Asf.RoadWorks.BusinessLogic.Localization;
using SmartTech.Infrastructure.Validations;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public abstract class RoadWorkBase
	{
		[Required]
		[RangeNumber(1900, 9999)]
		[Label(ResourcesConst.Year)]
		public short? Year { get; set; }

		public string AddressNumberFrom { get; set; }

		public string AddressNumberTo { get; set; }

		[Required]
		[Label(ResourcesConst.Description)]
		public string Description { get; set; }

		public string VisualizationNotes { get; set; }

		public string Notes { get; set; }

		public bool IsOverlap { get; set; }
	}
}