# Infra

- [Infra](#infra)
  - [Setup Tools](#setup-tools)
  - [Usage](#usage)

## Setup Tools

<details>
Install Terraform

```sh
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# To update to the latest, run
brew upgrade hashicorp/tap/terraform

# Verify the installation
terraform -help

# Enable tab completion
terraform -install-autocomplete
```

Install the Azure CLI tool

```sh
brew update && brew install azure-cli

az login  -u username -p password
# choose subscription
az account list --output table
# MFA
#https://docs.microsoft.com/zh-cn/cli/azure/manage-azure-subscriptions-azure-cli
az account set --subscription "Name"
#logout
az logout

```

</details>

## Usage

```sh
terraform plan -out=[filename]
terraform apply [filename]

terraform plan -destroy -out=[filename]
terraform apply -destroy [filename]
```
