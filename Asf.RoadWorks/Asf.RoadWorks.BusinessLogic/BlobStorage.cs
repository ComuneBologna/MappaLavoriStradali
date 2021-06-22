using SmartTech.Infrastructure.Storage;

namespace Asf.RoadWorks.BusinessLogic
{
	public class BlobStorage :
		StorageContainer
	{
		const string _roadworksContainreName = "roadworks";

		public BlobStorage(string containerName) :
			base(containerName)
		{

		}

		public static BlobStorage RoadWorks => new BlobStorage(_roadworksContainreName);

		public static BlobStorage GetContainerByName(string containerName) =>
			containerName switch
			{
				_roadworksContainreName => RoadWorks,
				_ => default
			};
	}
}