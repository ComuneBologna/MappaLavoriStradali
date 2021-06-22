FROM mcr.microsoft.com/dotnet/sdk:3.1 AS previousbuild

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
COPY --from=previousbuild ["/usr/share/dotnet", "/usr/share/dotnet"]
COPY . /src/dotnet-function-app
RUN cd /src/dotnet-function-app && \
mkdir -p /home/site/wwwroot && \
dotnet publish **/*RoadWorks.Functions.csproj --output /home/site/wwwroot

FROM mcr.microsoft.com/azure-functions/dotnet-isolated:3.0-dotnet-isolated5.0
RUN apt-get update -y && apt-get install -y libgdiplus
RUN apt-get update -y && apt-get install -y libfontconfig
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY --from=build ["/home/site/wwwroot", "/home/site/wwwroot"]