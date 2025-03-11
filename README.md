# OpenBudget

[![Go Report Card](https://goreportcard.com/badge/github.com/schweller/openbudget)](https://goreportcard.com/report/github.com/schweller/openbudget)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

OpenBudget is a self-hosted, open-source budgeting and personal finance management solution. It features a TypeScript frontend and a Go backend, designed for individuals and small organizations who want full control over their financial data.

## Features

- **Privacy-focused**: Your financial data stays on your own server
- **Multi-platform**: Works on desktop and mobile browsers - Coming soon!
- **Reporting**: Generate insights with customizable reports and dashboards - Coming soon!
- **Categorization**: Automatic and manual transaction categorization - Coming soon!
<!-- - **Import/Export**: Support for common financial data formats (CSV, OFX, QFX)
- **Multi-user**: Optional shared access for families or teams
- **API-first**: Well-documented API for integration with other tools -->

## Quick Start

### Using Docker

```bash
docker run -d --name openbudget -p 8080:8080 schweller/openbudget
```

### Manual Installation

#### Prerequisites
- Go 1.21 or newer
- Node.js 18 or newer
- PostgreSQL 14 or newer

#### Backend Setup
```bash
git clone https://github.com/schweller/openbudget
cd openbudget/backend
go build
./openbudget
```

#### Frontend Setup
```bash
cd ../frontend
npm install
npm run build
```

<!-- ## Configuration

OpenBudget can be configured via environment variables, command-line flags, or a configuration file. See the [configuration documentation](docs/configuration.md) for details. -->

## Development

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Run backend in development mode
cd backend
go run main.go --dev

# Run frontend in development mode
cd frontend
npm run dev
```

## Roadmap

### Q2 2025
- [ ] Debt payoff calculator and planning tools
- [ ] Budgeting templates and wizards
- [ ] Multiple currency support
- [ ] Improved transaction search

### Q3 2025
- [ ] Mobile app (React Native)
- [ ] Investment portfolio tracking
- [ ] Document attachment for transactions
- [ ] AI-powered spending insights

### Q4 2025
- [ ] API plugins system
- [ ] Goal setting and progress tracking
- [ ] Shared budgets for households
- [ ] Financial institution integration via API

## License

OpenBudget is released under the MIT License. See the [LICENSE](LICENSE) file for details.
