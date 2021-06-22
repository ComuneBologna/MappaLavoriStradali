using Asf.RoadWorks.DataAccessLayer.Entities;
using System;

namespace Asf.RoadWorks.DataAccessLayer
{
	public static class DataAccessLayerExtensions
	{
		public static void SetRoadWorkStatus(this RoadWorkEntity workEntity)
		{
			var now = DateTime.UtcNow;

			if (workEntity.Status.HasValue && workEntity.Status == RoadWorkStatus.Deleted)
				workEntity.Status = RoadWorkStatus.Deleted;
			else if (!workEntity.EffectiveStartDate.HasValue && !workEntity.EffectiveEndDate.HasValue)
				workEntity.Status = default;
			else if (workEntity.EffectiveStartDate.HasValue && workEntity.EffectiveEndDate.HasValue && now > workEntity.EffectiveEndDate)
				workEntity.Status = RoadWorkStatus.Completed;
			else if (!workEntity.EffectiveStartDate.HasValue || now < workEntity.EffectiveStartDate.Value.AddDays(-5))
				workEntity.Status = RoadWorkStatus.NotStarted;
			else if (workEntity.EffectiveStartDate.HasValue && now >= workEntity.EffectiveStartDate.Value.AddDays(-5) && now < workEntity.EffectiveStartDate)
				workEntity.Status = RoadWorkStatus.ComingSoon;
			else if (workEntity.EffectiveStartDate.HasValue && now >= workEntity.EffectiveStartDate.Value)
				workEntity.Status = RoadWorkStatus.InProgress;
			else workEntity.Status = default;
		}
	}
}