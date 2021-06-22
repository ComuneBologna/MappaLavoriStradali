namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// Road work attachment info model
	/// </summary>
	public class RoadWorkAttachmentInfo
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
		public bool? IsPublic { get; set; }

		/// <summary>
		/// Gets or sets the name.
		/// </summary>
		/// <value>
		/// The name.
		/// </value>
		public string Name { get; set; }

		/// <summary>
		/// Gets or sets the type of the content.
		/// </summary>
		/// <value>
		/// The type of the content.
		/// </value>
		public string ContentType { get; set; }
	}
}