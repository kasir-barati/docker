# Run in dev env:

```cmd
cp .env.example .env
pnpm i --frozen-lockfile
pnpm build
docker compose up
```

# The CI workflow

- You need to manually allow GitHub Action to push on your repositroy. For this reason the initial setup will fail. You need to enabled permission and re-run failed job: [see video](https://user-images.githubusercontent.com/6702424/213480604-0aac0ea7-487f-491d-94ae-df245b2c7ee8.mov).
- This CI is configured to publish [the app](https://starter.keycloakify.dev) on [GitHub Pages](https://github.com/codegouvfr/keycloakify-starter/blob/3617a71deb1a6544c3584aa8d6d2241647abd48c/.github/workflows/ci.yaml#L51-L76) and on [DockerHub](https://github.com/codegouvfr/keycloakify-starter/blob/3617a71deb1a6544c3584aa8d6d2241647abd48c/.github/workflows/ci.yaml#L78-L123) (as a Ngnix based docker image). In practice you probably want one or the other but not both... or neither if you are just building a theme (and not a theme + an app).  
  If you want to enable the CI to publish on DockerHub on your behalf go to repository `Settings` tab, then `Secrets` you will need to add two new secrets:
  `DOCKERHUB_TOKEN`, you Dockerhub authorization token.  
  `DOCKERHUB_USERNAME`, Your Dockerhub username.
  We deploy the demo app at [starter.keycloakify.dev](https://starter.keycloakify.dev) using GitHub page on the branch `gh-pages` (you have to enable it).  
  To configure your own domain name please refer to [this documentation](https://docs.gitlanding.dev/using-a-custom-domain-name).
- To release **don't create a tag manually**, the CI do it for you. Just update the `package.json`'s version field and push.
- The `.jar` files that bundle the Keycloak theme will be attached as an asset with every GitHub release. [Example](https://github.com/InseeFrLab/keycloakify-starter/releases/tag/v0.1.0). The permalink to download the latest version is: `https://github.com/USER/PROJECT/releases/latest/download/keycloak-theme.jar`.
  For this demo repo it's [here](https://github.com/codegouvfr/keycloakify-starter/releases/latest/download/keycloak-theme.jar)
- The CI publishes the app docker image on DockerHub. `<org>/<repo>:main` for each **commit** on `main`, `<org>/<repo>:<feature-branch-name>` for each **pull-request** on `main`
  and when **releasing a new version**: `<org>/<repo>:latest` and `<org>/<repo>:X.Y.Z`
  [See on DockerHub](https://hub.docker.com/r/codegouvfr/keycloakify-starter)

![image](https://user-images.githubusercontent.com/6702424/225972266-86bae7ed-d097-47a3-aff0-a6b00c92ad1a.png)

![image](https://user-images.githubusercontent.com/6702424/225972250-75288953-d18a-4c5a-8c65-a676e927d736.png)

If you want an example of an app that put that setup in production checkout onyxia-ui: [the repo](https://github.com/InseeFrLab/onyxia-ui), [the login](https://auth.lab.sspcloud.fr/auth/realms/sspcloud/protocol/openid-connect/auth?client_id=onyxia&redirect_uri=https%3A%2F%2Fonyxia.lab.sspcloud.fr), [the app](https://datalab.sspcloud.fr).

## .github/workflows/ci.yaml

```yml
name: ci
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    if: github.event.head_commit.author.name != 'actions'
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2.1.3
        with:
          node-version: '16'
      - uses: bahmutov/npm-install@v1
      - run: yarn build
      - run: npx keycloakify
      - uses: actions/upload-artifact@v2
        with:
          name: standalone_keycloak_theme
          path: build_keycloak/target/*keycloak-theme*.jar
      - uses: actions/upload-artifact@v2
        with:
          name: build
          path: build

  check_if_version_upgraded:
    name: Check if version upgrade
    runs-on: ubuntu-latest
    needs: build
    outputs:
      from_version: \${{ steps.step1.outputs.from_version }}
      to_version: \${{ steps.step1.outputs.to_version }}
      is_upgraded_version: \${{ steps.step1.outputs.is_upgraded_version }}
    steps:
      - uses: garronej/ts-ci@v1.1.7
        id: step1
        with:
          action_name: is_package_json_version_upgraded

  create_github_release:
    runs-on: ubuntu-latest
    needs:
      - check_if_version_upgraded
    # We create a release only if the version have been upgraded and we are on a default branch
    # PR on the default branch can release beta but not real release
    if: |
      needs.check_if_version_upgraded.outputs.is_upgraded_version == 'true' &&
      (
        github.event_name == 'push' ||
        needs.check_if_version_upgraded.outputs.is_release_beta == 'true'
      )
    steps:
      - run: mkdir jars
      - uses: actions/download-artifact@v2
        with:
          name: standalone_keycloak_theme
      - run: mv *keycloak-theme*.jar jars/standalone-keycloak-theme.jar
      - uses: softprops/action-gh-release@v1
        with:
          name: Release v\${{ needs.check_if_version_upgraded.outputs.to_version }}
          tag_name: v\${{ needs.check_if_version_upgraded.outputs.to_version }}
          target_commitish: \${{ github.head_ref || github.ref }}
          generate_release_notes: true
          files: |
            jars/standalone-keycloak-theme.jar
          draft: false
          prerelease: \${{ needs.check_if_version_upgraded.outputs.is_release_beta == 'true' }}
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
```
