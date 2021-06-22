namespace Asf.RoadWorks.API.Models
{
	/// <summary>
	/// Address model for map
	/// </summary>
	public class AddressMap
	{
		/// <summary>
		/// Gets or sets the name of the address.
		/// </summary>
		/// <value>
		/// The name of the address.
		/// </value>
		public string AddressName { get; set; }

		/// <summary>
		/// Gets or sets the latitude (Y).
		/// </summary>
		/// <value>
		/// The latitude.
		/// </value>
		public double Lat { get; set; }

		/// <summary>
		/// Gets or sets the longitude (X).
		/// </summary>
		/// <value>
		/// The longitude.
		/// </value>
		public double Lon { get; set; }
	}
}