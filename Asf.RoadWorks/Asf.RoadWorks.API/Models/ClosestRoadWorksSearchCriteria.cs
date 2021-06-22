namespace Asf.RoadWorks.API.Models
{
	/// <summary>
	/// Closest road works search criteria model
	/// </summary>
	public class ClosestRoadWorksSearchCriteria
	{
		/// <summary>
		/// Gets or sets the latitude.
		/// </summary>
		/// <value>
		/// The latitude.
		/// </value>
		public double Latitude { get; set; }

		/// <summary>
		/// Gets or sets the longitude.
		/// </summary>
		/// <value>
		/// The longitude.
		/// </value>
		public double Longitude { get; set; }

		/// <summary>
		/// Gets or sets the year.
		/// </summary>
		/// <value>
		/// The year.
		/// </value>
		public short? Year { get; set; }
	}
}