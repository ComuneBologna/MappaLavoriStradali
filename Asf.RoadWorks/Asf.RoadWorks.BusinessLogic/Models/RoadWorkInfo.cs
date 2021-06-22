using System;
using System.Collections.Generic;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class RoadWorkInfo : RoadWorkBase
	{
		public string CompanyName { get; set; }

		public string PersonName { get; set; }

		public string PersonSurname { get; set; }

		public string PersonEmail { get; set; }

		public string AddressName { get; set; }

		public List<string> Neighborhoods { get; set; }

		public string CategoryName { get; set; }

		public string NotPlannedStatus { get; set; }

		public DateTime? StartDate { get; set; }

		public DateTime? EndDate { get; set; }

		public IEnumerable<string> RoadWays { get; set; }
	}
}