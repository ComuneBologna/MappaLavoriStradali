using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asf.RoadWorks.DataAccessLayer.Entities
{
	[Table("RoadWorkNeighborhoods", Schema = Schemas.RoadWorks)]
	public class RoadWorkNeighborhoodEntity
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public long Id { get; set; }

		[Required]
		public long RoadWorkId { get; set; }

		[Required]
		public string NeighborhoodName { get; set; }

		[ForeignKey(nameof(RoadWorkId))]
		public RoadWorkEntity RoadWork { get; set; }
	}
}