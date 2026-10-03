# Case images

Put the real case images here and point to them from `CONFIG.images` in `index.html`.

| Key | What | Physical width | Notes |
| --- | --- | --- | --- |
| `field40` | 40x field of the feature | 0.5 mm | 16:9, the feature slightly right of centre |
| `field4` | 4x view of the lesion | 5 mm | 16:9, centred on the same point as the 40x crop |
| `slide` | Photo or macro scan of the glass slide | 76 mm | 3:1, the tissue section centred on the same point |

The zoom treats each image as that many millimetres wide and nests them on one
centre point, so crops that share a centre line up as the camera pulls back.
