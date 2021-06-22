namespace Asf.RoadWorks.BusinessLogic.Models
{
	/// <summary>
	/// Valid year model
	/// </summary>
	public class ValidYear
	{
		/// <summary>
		/// Gets or sets the year.
		/// </summary>
		/// <value>
		/// The year.
		/// </value>
		public short Year { get; set; }

		/// <summary>
		/// Gets or sets a value indicating whether this instance is default.
		/// </summary>
		/// <value>
		///   <c>true</c> if this instance is default; otherwise, <c>false</c>.
		/// </value>
		public bool IsDefault { get; set; }
	}
}