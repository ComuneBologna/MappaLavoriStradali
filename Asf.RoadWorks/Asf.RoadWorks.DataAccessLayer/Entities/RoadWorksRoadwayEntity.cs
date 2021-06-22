using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Asf.RoadWorks.DataAccessLayer.Entities
{
	[Table("RoadwaysInWorks", Schema = Schemas.RoadWorks)]
	public class RoadWorksRoadwayEntity
	{
		[Required]
		public long RoadWorkId { get; set; }

		[ForeignKey(nameof(RoadWorkId))]
		public RoadWorkEntity RoadWork { get; set; }

		[Required]
		public short RoadwayId { get; set; }

		[ForeignKey(nameof(RoadwayId))]
		public RoadwayEntity Roadway { get; set; }
	}
}