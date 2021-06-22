using SmartTech.Infrastructure.Maps;
using System.Collections.Generic;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class GeoFeatureContainerMapModel
	{
		public long Id { get; set; }

		public string Label { get; set; }

		public MapCoordinate Center { get; set; }

		public List<GeoLayerMapModel> GeoLayers { get; set; } = new List<GeoLayerMapModel>();

		public List<PointMapModel> Points { get; set; } = new List<PointMapModel>();
	}
}