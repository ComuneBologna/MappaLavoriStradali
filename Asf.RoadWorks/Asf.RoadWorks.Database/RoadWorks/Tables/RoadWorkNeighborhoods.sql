CREATE TABLE [RoadWorks].[RoadWorkNeighborhoods]
(
	[Id] BIGINT IDENTITY(1,1) NOT NULL,
	[RoadWorkId] BIGINT NOT NULL,
	[NeighborhoodName] NVARCHAR(128) NOT NULL,
	CONSTRAINT [FK_RoadworksNeighborhoods_Roadworks] FOREIGN KEY ([RoadWorkId]) REFERENCES [RoadWorks].[Works] ([Id])
)