using SmartTech.Infrastructure.SystemEvents;

namespace Asf.RoadWorks.BusinessLogic.Events
{
	public class RoadWorksQueue : CustomQueue
	{
		private RoadWorksQueue(string queueName) : base(queueName) { }

		public static RoadWorksQueue CleanStorage => new RoadWorksQueue("clean-storage");

		public static RoadWorksQueue ImportWorks => new RoadWorksQueue("importworks");
	}
}