using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asf.RoadWorks.DataAccessLayer.Entities
{
	[Table("Logs", Schema = Schemas.Import)]
	public class ImportLogEntity
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }

		[Required]
		public long CompanyId { get; set; }

		[Required]
		public DateTime MigrationDate { get; set; }

		[Required]
		[MaxLength(512)]
		public string LogFilePath { get; set; }

		[Required]
		[MaxLength(256)]
		public string LogFileName { get; set; }

		[ForeignKey(nameof(CompanyId))]
		public CompanyEntity Company { get; set; }
	}
}