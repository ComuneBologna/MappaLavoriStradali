CREATE TABLE [RoadWorks].[RoadwaysInWorks]
(
	[RoadWorkId] BIGINT NOT NULL,
	[RoadwayId] SMALLINT NOT NULL,
	CONSTRAINT [FK_RoadwaysInWorks_Roadways] FOREIGN KEY([RoadwayId]) REFERENCES [RoadWorks].[Roadways] ([Id]),
	CONSTRAINT [FK_RoadwaysInWorks_Works] FOREIGN KEY([RoadWorkId]) REFERENCES [RoadWorks].[Works] ([Id]),
	CONSTRAINT [UK_RoadwaysInWorks] UNIQUE ([RoadWorkId], [RoadwayId])
)