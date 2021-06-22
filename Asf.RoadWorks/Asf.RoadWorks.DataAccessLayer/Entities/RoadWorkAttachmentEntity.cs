using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asf.RoadWorks.DataAccessLayer.Entities
{
	[Table("Attachments", Schema = Schemas.RoadWorks)]
	public class RoadWorkAttachmentEntity
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }

		public long? WorkId { get; set; }

		[Required]
		public string Name { get; set; }

		public bool? IsPublic { get; set; }

		[Required]
		public string ContentType { get; set; }

		[Required]
		public string BlobStoragePath { get; set; }

		[Required]
		public DateTime LastUpdate { get; set; }

		[ForeignKey(nameof(WorkId))]
		public RoadWorkEntity Work { get; set; }
	}
}