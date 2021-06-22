using Asf.RoadWorks.BusinessLogic.Localization;
using SmartTech.Infrastructure.Validations;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class CompanyBase
	{
		[Required]
		[Label(ResourcesConst.Name)]
		public string Name { get; set; }
	}
}