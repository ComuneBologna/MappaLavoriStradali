namespace Asf.RoadWorks.DataAccessLayer.Entities
{
	/// <summary>
	/// Road work status
	/// </summary>
	public enum RoadWorkStatus :
		byte
	{
		/// <summary>
		/// The completed
		/// </summary>
		Completed = 1,

		/// <summary>
		/// The deleted
		/// </summary>
		Deleted,

		/// <summary>
		/// The in progress
		/// </summary>
		InProgress,

		/// <summary>
		/// The not started
		/// </summary>
		NotStarted,

		/// <summary>
		/// The coming soon
		/// </summary>
		ComingSoon
	}
}