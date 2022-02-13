# Don't Deploy on Friday

GitHub Action to tell you "Don't deploy on Friday!". This action will fail with an error if the current day in the specified timezone is Friday.

<p align="center">
    <img src="meme.jpg" alt="Meme" width="350"/>
</p>

## Usage

Insert following step into your GitHub Actions workflow:

```yaml
steps:
  # Replace version by the latest version tag
- uses: HormCodes/do-not-deploy-on-friday@version
  # See Inputs section below...
  with:
    timezone: Europe/Prague
```

## Inputs

|  **Name**  | **Required** | **Description**                       | **Default** |
|:----------:|:------------:|---------------------------------------|:-----------:|
| `timezone` |   `false`    | Timezone to identify the current day. |     UTC     |

## Outputs

|  **Name**  | **Type**  | **Description**                                   |
|:----------:|:---------:|---------------------------------------------------|
| `dayName`  | `string`  | Name of the current day, e.g. `Friday`.           |
| `dayIndex` | `number`  | Index of the current day, e.g. 5.                 |
|  `failed`  | `boolean` | Boolean value representing current day is Friday. |

## License

This action and all its sources are under [MIT license](LICENSE).
