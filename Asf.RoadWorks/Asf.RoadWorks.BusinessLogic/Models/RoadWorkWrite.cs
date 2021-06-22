using SmartTech.Infrastructure.Maps;
using System.Collections.Generic;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class RoadWorkWrite : RoadWorkBaseExtended
	{
		public string GeoFeatureContainer { get; set; }

		public List<short> Roadways { get; set; } = new List<short>();

		public IEnumerable<string> Neighborhoods { get; set; }

		public MapCoordinate PinPoint { get; set; }

		public IEnumerable<RoadWorkAttachmentBase> Attachments { get; set; } = new List<RoadWorkAttachmentBase>();
	}
}