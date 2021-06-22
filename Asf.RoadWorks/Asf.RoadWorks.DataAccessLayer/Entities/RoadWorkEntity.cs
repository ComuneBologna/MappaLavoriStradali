using NetTopologySuite.Geometries;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asf.RoadWorks.DataAccessLayer.Entities
{
	[Table("Works", Schema = Schemas.RoadWorks)]
	public class RoadWorkEntity
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }

		[Required]
		public long AuthorityId { get; set; }

		public long CompanyId { get; set; }

		[Required]
		public short Year { get; set; }

		public bool IsOverlap { get; set; }

		public PriorityTypes? Priority { get; set; }

		public RoadWorkStatus? Status { get; set; }

		[Required]
		public string Address { get; set; }

		public string AddressNumberFrom { get; set; }

		public string AddressNumberTo { get; set; }

		public Point AddressPointFrom { get; set; }

		public Point AddressPointTo { get; set; }

		public Point PinPoint { get; set; }

		[Required]
		public RoadWorkCategories Category { get; set; }

		public NotScheduledCategoryStatus? NotScheduledStatus { get; set; }

		public string GeoFeatureContainer { get; set; }

		[Required]
		public string Description { get; set; }

		public string DescriptionForCitizens { get; set; }

		public string TrafficChangesMeasure { get; set; }

		public string Notes { get; set; }

		public string VisualizationNotes { get; set; }

		public DateTime? EffectiveStartDate { get; set; }

		public DateTime? EffectiveEndDate { get; set; }

		public DateTime? EstimatedStartDate { get; set; }

		public DateTime? EstimatedEndDate { get; set; }

		public string MunicipalityReferentName { get; set; }

		public string MunicipalityReferentPhoneNumber { get; set; }

		public string CompanyReferentName { get; set; }

		public string CompanyReferentPhoneNumber { get; set; }

		public string Link { get; set; }

		public virtual PublishStatus? PublishStatus { get; set; }

		[ForeignKey(nameof(CompanyId))]
		public CompanyEntity Company { get; set; }

		public ICollection<RoadWorkNeighborhoodEntity> Neighborhoods { get; set; }

		public ICollection<RoadWorksRoadwayEntity> RoadWays { get; set; }

		public ICollection<RoadWorkAttachmentEntity> Attachments { get; set; }
	}
}