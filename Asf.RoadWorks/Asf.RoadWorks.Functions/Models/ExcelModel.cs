using System;

namespace Asf.RoadWorks.Functions.Models
{
	public class ExcelModel
	{
		public short Year { get; set; }

		public string Address { get; set; }

		public string AddressNumberFrom { get; set; }

		public string AddressNumberTo { get; set; }

		public string Description { get; set; }

		public DateTime? EstimatedStartDate { get; set; }

		public DateTime? EstimatedEndDate { get; set; }

		public string NeighborhoodName { get; set; }

		public string RoadwayName { get; set; }

		public string VisualizationNotes { get; set; }

		public string Note { get; set; }
	}
}