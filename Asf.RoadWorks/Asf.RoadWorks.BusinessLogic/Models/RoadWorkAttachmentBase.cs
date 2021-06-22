namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// Road work attachment base model
	/// </summary>
	public class RoadWorkAttachmentBase
	{
		/// <summary>
		/// Gets or sets the identifier.
		/// </summary>
		/// <value>
		/// The identifier.
		/// </value>
		public long Id { get; set; }

		/// <summary>
		/// Gets or sets a value indicating whether this instance is public.
		/// </summary>
		/// <value>
		///   <c>true</c> if this instance is public; otherwise, <c>false</c>.
		/// </value>
		public bool IsPublic { get; set; }
	}
}