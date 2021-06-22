using System;
using System.Collections.Generic;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class GeoLayerMapModel
	{
		public Guid Id { get; set; }

		public bool CanBeRemoved { get; set; }

		public string Label { get; set; }

		public List<object> GeoFeatures { get; set; } = new List<object>();
	}
}