using Asf.RoadWorks.BusinessLogic.Enums;
using Asf.RoadWorks.DataAccessLayer.Entities;
using SmartTech.Infrastructure.Search;
using System;
using System.Collections.Generic;

namespace Asf.RoadWorks.BusinessLogic.Models
{
	public class RoadWorksFilterCriteria : FilterCriteria
	{
		/// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
		public long? Id { get; set; }

		/// <summary>
		/// Gets or sets the company identifier.
		/// </summary>
		/// <value>
		/// The company identifier.
		/// </value>
		public long? CompanyId { get; set; }

		/// <summary>
		/// Gets or sets the company is operational unit.
		/// </summary>
		/// <value>
		/// The company is operational unit.
		/// </value>
		public CompanyTypes? CompanyType { get; set; }

		/// <summary>
		/// Gets or sets the type of the visible.
		/// </summary>
		/// <value>
		/// The type of the visible.
		/// </value>
		public VisibleTypes? VisibleType { get; set; }

		/// <summary>
		/// Gets or sets the year from.
		/// </summary>
		/// <value>
		/// The year from.
		/// </value>
		public short? YearFrom { get; set; }

		/// <summary>
		/// Gets or sets the year to.
		/// </summary>
		/// <value>
		/// The year to.
		/// </value>
		public short? YearTo { get; set; }

		/// <summary>
		/// Gets or sets the neighborhood.
		/// </summary>
		/// <value>
		/// The neighborhood.
		/// </value>
		public string Neighborhood { get; set; }

		/// <summary>
		/// Gets or sets the name of the roadway.
		/// </summary>
		/// <value>
		/// The name of the roadway.
		/// </value>
		public string RoadwayName { get; set; }

		/// <summary>
		/// Gets or sets the status.
		/// </summary>
		/// <value>
		/// The status.
		/// </value>
		public RoadWorkStatus? Status { get; set; }

		/// <summary>
		/// Gets or sets the priorities.
		/// </summary>
		/// <value>
		/// The priorities.
		/// </value>
		public PriorityTypes? Priorities { get; set; }

		/// <summary>
		/// Gets or sets the overlaps.
		/// </summary>
		/// <value>
		/// The overlaps.
		/// </value>
		public bool? IsOverlap { get; set; }

		/// <summary>
		/// Gets or sets the description.
		/// </summary>
		/// <value>
		/// The description.
		/// </value>
		public string Description { get; set; }

		/// <summary>
		/// Gets or sets the name of the address.
		/// </summary>
		/// <value>
		/// The name of the address.
		/// </value>
		public string AddressName { get; set; }

		/// <summary>
		/// Gets or sets the effective start date from.
		/// </summary>
		/// <value>
		/// The effective start date from.
		/// </value>
		public DateTime? EffectiveStartDateFrom { get; set; }

		/// <summary>
		/// Gets or sets the effective start date to.
		/// </summary>
		/// <value>
		/// The effective start date to.
		/// </value>
		public DateTime? EffectiveStartDateTo { get; set; }

		/// <summary>
		/// Gets or sets the effective end date from.
		/// </summary>
		/// <value>
		/// The effective end date from.
		/// </value>
		public DateTime? EffectiveEndDateFrom { get; set; }

		/// <summary>
		/// Gets or sets the effective end date to.
		/// </summary>
		/// <value>
		/// The effective end date to.
		/// </value>
		public DateTime? EffectiveEndDateTo { get; set; }

		/// <summary>
		/// Gets or sets the publish status.
		/// </summary>
		/// <value>
		/// The publish status.
		/// </value>
		public PublishStatus? PublishStatus { get; set; }

		/// <summary>
		/// Gets or sets the categories.
		/// </summary>
		/// <value>
		/// The categories.
		/// </value>
		public List<RoadWorkCategories> Categories { get; set; } = new List<RoadWorkCategories>();

		/// <summary>
		/// Gets or sets the not scheduled status.
		/// </summary>
		/// <value>
		/// The not planned status.
		/// </value>
		public NotScheduledCategoryStatus? NotScheduledStatus { get; set; }
	}
}