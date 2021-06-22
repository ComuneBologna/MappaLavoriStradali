using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asf.RoadWorks.DataAccessLayer.Entities
{
	[Table("Configurations", Schema = Schemas.RoadWorks)]
	public class ConfigurationEntity
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }

		[Required]
		public long AuthorityId { get; set; }

		[Required]
		public short Year { get; set; }

		[Required]
		public DateTime SubmissionStartDate { get; set; }

		[Required]
		public DateTime SubmissionEndDate { get; set; }
	}
}