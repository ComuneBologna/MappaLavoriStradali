using Asf.RoadWorks.BusinessLogic.Localization;
using SmartTech.Infrastructure.Validations;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class CompanyWrite : CompanyBase
	{
		[Required]
		[Label(ResourcesConst.IsOperationalUnit)]
		public bool? IsOperationalUnit { get; set; }
	}
}