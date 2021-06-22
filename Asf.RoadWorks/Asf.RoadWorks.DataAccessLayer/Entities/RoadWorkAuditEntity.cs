using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asf.RoadWorks.DataAccessLayer.Entities
{
	[Table("Works", Schema = Schemas.Audit)]
	public class RoadWorkAuditEntity
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }

		public long WorkId { get; set; }

		public string DisplayName { get; set; }

		public DateTime LastUpdate { get; set; }

		public AuditTypes AuditType { get; set; }

		public string BlobStoragePath { get; set; }
	}
}