using Asf.RoadWorks.BusinessLogic.Localization;
using SmartTech.Infrastructure.Validations;
using System.IO;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class RoadWorkFile
	{
		[Required]
		[Label(ResourcesConst.Name)]
		public string Name { get; set; }

		public string ContentType { get; set; }

		[Required]
		[SkipChildPropertiesValidation]
		public Stream Content { get; set; }
	}
}