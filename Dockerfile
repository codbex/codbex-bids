# Docker descriptor for codbex-bids
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.16.0

COPY codbex-bids target/dirigible/repository/root/registry/public/codbex-bids
COPY codbex-bids-data target/dirigible/repository/root/registry/public/codbex-bids-data

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-bids/gen/index.html