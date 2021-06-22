using Asf.RoadWorks.BusinessLogic.Localization;
using Asf.RoadWorks.DataAccessLayer.Entities;
using SmartTech.Infrastructure.Validations;
using System;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class RoadWorkBaseExtended : RoadWorkBase
	{
		public long CompanyId { get; set; }

		public PriorityTypes? Priority { get; set; }

		[Required]
		[Label(ResourcesConst.Address)]
		public string Address { get; set; }

		public string DescriptionForCitizens { get; set; }

		public DateTime? EffectiveStartDate { get; set; }

		public DateTime? EffectiveEndDate { get; set; }

		public DateTime? EstimatedStartDate { get; set; }

		public DateTime? EstimatedEndDate { get; set; }

		public RoadWorkCategories Category { get; set; }

		public NotScheduledCategoryStatus? NotScheduledStatus { get; set; }

		public string MunicipalityReferentName { get; set; }

		public string MunicipalityReferentPhoneNumber { get; set; }

		public string CompanyReferentName { get; set; }

		public string CompanyReferentPhoneNumber { get; set; }

		public string Link { get; set; }

		public string TrafficChangesMeasure { get; set; }
	}
}