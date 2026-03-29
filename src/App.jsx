import React, { useMemo, useState } from "react";

const LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABICAYAAABMb8iNAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAABLKADAAQAAAABAAAASAAAAAB/joDPAABAAElEQVR4AeR9BXiUV9b/GU8m7u7unkCCBC8UCi1LaaG29W2/dqtb2bbLV6NUqLs7LS0tUlyCRYC4u7vrJKP/330nCQkJkMwA7X7/+zzJvO+Vc+9r5x4/PPrrFv7s2bOtent7FTyeicjQUMVjS5XJZJrMzMwOilohofSdA6PLD080J4WET/n7Ori6xEQhud/qQV/9vZQ7Z+3+q6W05YEG7jzhBkeqPNZFDQ0DdM0Gb9qxs5ooXUnXbXKibU/Uk02QEflE21Hy1+W0ZqM3bX2qjK56yJ32ZtVRqNiS+tqHyDHMiorTWihorj0ZmnVTziE1+cdYUU+7jCKXP002XnNJpRgcXeOUD3giMjRppe2vr6f07xqnPMwhwI3u+vpHUgwaYYxqyuPGdhRLJVR24jb6/qHTY6svcsynh3f9RFLLAFIr5RfpO3kzXyCkob56ev2WvxE199ONb91EfrOepqEBHe7f5FNwtSIDKdXlfkJf3LGZO39412dkZBlPKqVu8/D4Atzvbvr83uXUUdZzgZmn1rTs8dso9gZcd3/f1Aac20vDw7soop0vPUant+4l35lOdNP735Cs35ZIozi393/ROZ+I1yP8ExcssLOzM2DzR0ZGSk1Rhoa0q1GpBtRufn5UU1IycNttdwXv3r29oa6rq99QpeIFBgYKw+LiXHpbe/jkvlogl8uVDg4Okk6+Ue+RI6d6ANSoubl5kJKSlBTjePajzUrqJetgF8ygRVgkNSGxLRAeEFZzRi/F+dtRWnod9dWKyD3GjqpOt9L82wXcilrLB8k3yprK0vtptpsNddYIiSchEhrwyUQmIDWQaUcrn/zjbIgGleTgryKRtI806gCMV2uvajr/NXg4GCdUR+B36gjLf443HupMbux0phvfl08aWoSqqSOsWbc4k7lTIg32Wus8twbXLBCXc8iKrUcoXEoajY73jwE4X2HzCJejVYuwBnu6ychK93k0aj4ZW8op6qoQOvDeyfPNOuX6gEVzSS7zQX8d3hs2C49PPEEPCcX13JxCqSee53wgK3aqI0wO0p/8j3tuOVcSYQnc3d1FQE7WbW1touDoaOW82fMCTiQldTY3d9YfOfJHk1qt5qgodmd27tw5+Mgjj3ju3buv49dff61AFWvTJCUl4Yc75pDJggULrAJDo2xPHj04EOdtbmNstUTo6eRE2dlFeN8HB/YQidCfPSg1Sa1lw2M11FTUSSHLLagqq4saK+XkGmGGNqLq4iEKmCEEwlJRY6GAHB2l1FqmxK4loezDbeTo50l5DRW0AhRaW3EHWSdYEl8sI9GgGUlM+4lMiToahNTbkEmz78SsKoZ8pl+Ucj65hMygNNo95cEe0cu5O0Ok25xsIhU2YSu3BTh6ecrzEi8RfRmyYkW3uYViotKTyRwEu1Aj8poRAepKd3gcoEn+KbArOicEU8hCT8o9WEHJP5yg6158BNet27q5KXhYvGgxDvVDWGZmFkCm7N6cott6QPBRb3M1pXyfx0GJv202KUcJK91gcoD+5H8C3OKW8rzLjrBcXV0tvL2DTePjI6UNDa1iqVQ0xAN1YmFoaicW8wfb25vrmpraJLGxc6xAnQhQNP1qtXxufHy4laWleWlpbc7atWt9zcxsVUKhSJ6VlcU3NhaqW1paetFXvnjZMo/XX3khu66ujiEjrgAxGvQIheIlMTGGa9fe7OfkZCOvrq42qO06Xn9qeKuh8uQu8o5y4AbU5HbTnDts6cQ3Iio+0EDeMcGoryMxv58sfE0pP6mZ1m7yB8JqIocAUG1JRAPtJlSQ1kUzVguou1ED5NVJhrHmNCgXkdBQTvbe2cCYtYDDqLrpF8ZZecfPx8AX8Df6xl0QkIHZLCDIC3a5aKMK89p5B5LnLFeqOFFz0f6sQ/TqaJJzyGVK3SftJDIYotqCZK7NWBoOKoFRPZenaDQ2ZOsfSgSEpRKcIT6/CRPZ6zzZEPapsGVRdOBNnUFwA2Nu8SOpqfMwotYNFkNYA10HMZgjqcjYCpSqnu+Ebiu5tKMEoDs6Go5cFoQVFBQkdnZ2dl20dKmHsYlJn6ynR9ba2qpua2vsl0gkHYODSkczS3Onb774IrO2thZcnVzW3l7PUygUfKVSqQCraDwwODjwzN13sx1Le+NBVXl7e5ugSJqauuX33POgvbGxQWRZWXH54sWrLNLTj1tmZ2e3or+8qqqKySMGfyzjZArN//rXvwLc3LyNbUyaTeIeeMS5t7eje/uxY52dbVWlw3dVTXVFIrKxkVBrq4LEwOZshyvb30LBa/2AsJpoaEiKOhXVnOGTudKQJNJucvZUkKJfQ3zRALknmpByECyiWwfqTKirsptqjYvIJcyFlNjVp1s0uGyxYTjNuM2JUr+quujwoAWB5BjgS/0d6DpKqF502MQOGKuU25OlfRBV0BQQlp0RiY3nATlPBDXVGh7mHIT8qqk6nRsSs3YmR+lNdfx0+7HnEbp0Dh1673fK215Ls28sJWt3e1z3dCFp+2tAwBuaJHDyopKUet2AYJSh+VJwdPo8PAJbTZT8/WFuDfHr3MjaxZ/6O3Ve0l9moFoJIcWWk5cSYfGAqIxWrLjOJzI21shIIvHv7Olq3/L9T1VBQYHi5uYGuYLP14BqsvfxsXP65acfkvr78bGjGBkZCVSQTwmFQl5cYqLJvIS5kUmH9lWDsvIRi00Ehob8/r179/Z2dXUpy8rKGFIStre3mrzyyge7Ozs7u0NDQ20h25IuXLjQc2hoSHTy5MmmBgjTIcvqv/vuB7zQh//pp59qd298zfOXL3e8/dq1Tv39nfwMwYLGU6cOtYN3a6KgleaU9Fkf1eS0U9gaB8reWk8zbbTYpuxMHUVd50B9Pc0UNF8KSkxGhvYWNIjmhlw5Bc4zoua6RhIZ2ZMAyK5vqI+cRAew1kXsGqdfcGsEIiOytJ2HsV9edHzg4ijIPsCP6ve+c/MwtjB2zQI68ws46ouUuIVuJDHy0/ljZ+D5eA17m49RVZJW8G3rvpjUjIu/jEWjXgDoIEeYckK1F4hitl6zCUTmFP23MNIHYXnEgFLVTfavXTveGaGomWTdudw53zAWiH+EVdfr8v7cwdy3kEGKpupLgrDAgpmvXbs+cMaMODeNQNgwNCjzJqlBZ9qZtGJQRAJfX19lY0cTz1gk4s1PXOCdX5Bbb2FhIbaychbweIP44wkgc+/58ccfu5YtWznzpeefS8vJyWkZuUmJiYnW3kFBlmH+/hrIv5xDQsKDy+uqs4CIelkf1hd/7JA3c+ZMA1B39guWLrUzkUo95DJl60svbQAnOFo0h3ftqmd/NjY2xtddd53rvHnx9nuOH2rNGRpq5np1VyrJFqwgK2UpcnLyt6K+nCEymWVN6dsaacE/XGioo5T8lxlT4YE2cp9hAc1gN5n7WFJ7mYysPDHGT0gd1cVk682B0ekfUzA6Q441FYRl75MIIb9O00wYxNhKYxuGKC9e7DwWQcAr0omKHIHOyP28g4e407hr7MjaK5hkXSOtl/5Xhd3a0sWLZt0eTCe+yKacPcdpoZ9+8zAKU6lZBiBTlzmOndExyJUsneKgHRxbO71jRl01lhRQ4eFqbmDM6gRsYtOD8VfsLYJuruJUBtPo64WwQkJCLJYtuyYkJi7WTygSDcn6+stIoHA3MpIOHDm4r7ilrk4pEonUn3/+YU9ycnInWLOIkoLc8ldeeKEUyILju1g7o4aiohaaffvDT1cfPrC3JTw83CAxcYlPVVWxph1CLgjaQQFR2+E9e3jPP/9ybGtrZ0Z1SYnq6ac3BFZWFitLSlob09MPMpWyJiUlhT2hSrCPIUNicX1NdVnPY08/Hbx/V1JTTk7yKBJkzwVsat/HH39c4OnpZfa0aXNfS0tLQ0hIiNuyZQucjhzZ35CWlqalpNDm5+dncv369YFvv735WEFBgeLqq6/1AGvp9OWX75bVscGZO5rp2me1QvjOSimrotpcJUwfYMKg7iczUx5ZOsqpt05Njp5EXS3GJFf3kK25iAQwcehsLCRze3/Y+XBDp/1PowohO2cXICx2XyYvdnERmMPtksoqlEPmZOYcjQnPj7DsvGzJNTwa9lPopiMryoTEPS2lVLhfq9WKWRNzRagCOSiZ6FXxdPLLj6kkvY266vMhQ/KCHdnk9/iitaCw+MJwci3xh+Qv/6Ldz+3Al1x1btW0z7EEqi9I4sYl3OpDZrYBegnwp72AyzEA75VyqJfa8k8y6HhbpleuvvrqgEce+ddDAYFBSxVKRREE5jVCPl8Jrq5NrSG3jMwzNeXFxU1yOV8FhR8P7QonJydLX19/p+NHTxaYm1sJcjJOdaMweVTb3r27mh988F6/5uZGg87Onrb58+e429vbG4CyUkB43pWVld566tSp1kcffSJYIBAZ8/k0JEWprKxkailld0vL4JkzZ9obG+u6EhISLO69//4lxubmyk0bX+B4RHZ1PT09yjNpae1VVRXdQEaO8+cvce7p6eqNjo42xnngl59/DuVjVh8zUs3ION0K2Zp6/fr1frDvMsjNhQZRbC2g5sIecgXesgswoPp0GYUvNaRiGJ46+FpTe6Wa2qoHYfpgSyRpJ0ORMQ3KDGmgX0YSYwOydF2msxBZZMCD1rGY8vaOZWvHPzS/edeCdVyh8xzjoWnPGHtp7dZKyd/umqyZq0u8OwyC/kd1RsYMCCP3Gwp/oayde3AmpDl3vgiKy1kvIT63uCn8E8MWrz77a2wqQ+QeC82h51K97iFfKCSR5ARYMi3yncISRrssf/J/IbdzOqtjGm2Z+oFIXEl/vPUK9cPw1m/e38gtcpVerPrUZ758PWFWBrleCv381PuYRD1lCgvUjcFDDz1yp7eP/1UyWHj298v2CUWCFgFpmiD3lhsbG88oLCzMyiwoKDHm8QwN8B4OqHkCO1tbg6jYGSHbt/+adOzYsT5QNGRpaWmo0WhEixcvtu/tlbkYGZlJQC2dGDFNgIW7zcqVK+2G1GqP+qqqWnt7V8utW39s3rdvXxkWLbztttucn332+dCTJ1PbDh/e3YA6BZDfEGyyDJKPH88cRAG7GJGUtL8OrOgoG8jgv/vuuwWg3oyefPLfiUBI0ieffHwn6sdJOtPT09vw13733Xd7Pvnss+EHPv+8kFNf5f/RR0Gr3am+KI+CFzlTf1072a4CxZXTSV6zLElq3ANqQUxCOxEZQ4soV/Bgj5VLA51DMDKV6PQyMjmWoy8T3L+Lv8lL5Mo5l4UqUasWgD41hIUH+J1JiqXLEp0pq7Hg+joYsiKKWOZEUvMg3amcsUAvcsxkTgbGHhSyAtrQ9GTK+u0IecUyGkVHUpHNh+EWLstx8CM7m3Lxig8GdRcAYfmUh0zoyD5sWX8ONQ/Lfr3jZpJi8sc2YexfuYJd10BXMpbIkb5TQljQ1gXcuP7W12Fx4CQbHKgwMDA4Khbwqls7O1WqITmvqqqs19bW6UxWUW6TtZmZGThOAVOtWSj5mpkzZzllZGdmAIdoIHy3jI2NFUFmJSouLm789ttvux545BGbHTu2Va9et861v6NX0txc1wCj0fbjx48zbSA9/Pjjc8NCw53bf2tkvDlbr/Krr76qwm/tunV3OD+9YUPQvp07mwMCwmxBzXWApaxFG+w9HVtXrVrlBuTnsGnTpiJUabV9INxZfVlZVen27dsGbr/nnpCfvttRnp+fwuwBxhbNJ598Um5jE2R8//33BXrmZ7dzrKilh1YaLLEdJGZR31wuwgsPrdoqU8o9UUfOLpZ4Ubqov8+IRBBG97c0kI8gGy9z7FjgUz5mLIqZYxB5R9hQWSZ3T8aNDVpiCSol4ZIJ3EeAc3IsO2eavzyEDn80OXVn6ZpAzG5L54IPnC9qo5Nfa9ldh+D5MOUwIRnkf1eiaGCorFGzzSCZWhursZYcUFhhOk/N2H4z+yjC5k5a05qpgfIBwlLJjafW+Ty9JJBW5O5N4lqZksjmEsgWzzPVFa02wG3J+YMhLK5cFGGtXbtuzS233fYRkFULj0e/VFVXZmdnZBR1dKjq//jjB/Zm8fCAYBleVebOflEgt2ImChogEL6hoUDT3NzF2VCBAusHMmoCNUQPP/mk05yZs+KPHDpSePjw4Rr8sd3NAMjRdcOGl5xTUo7VQG4lMhQZtd928/rjYN2cn39+Y0hS0oEW9K1HX9UPP3xezRDTa5vfvkalknc+/5//MMTEFSbI/+CDDwpBxdm++OKmkH37dlUDCbZvfOONsO1bt3ampqZWsY75+fldN998s9fixTMsIfNiFNy40tqa39/V361MTFzobmPjZPDBB09o5yg/1E2+82HCoB4gN1ceKYa6yDNcjHMZ3HSkkGupSGKgIivvAQgMs8jeh6mYx8Ge2gk2fJXCkxzCA4GwGNIeX9zComBWYH+ZPnIJ8QVzMeFEhOURDxsf92BQj2jWkShhwtTmkkx4FFRzFxWyeBbsscZf3+U8Y8auIQtjacfzUOlAqdGYn0r2fmE6KxHUeL4Wjl5kHBRJVDX6kV30ErxmLNFPYYL7rxhSU3X6AW6u6DXeUPZ46HwdF13wFerAqKv+jiaqyE0dmfFCbxrv7Xfff9nXz/+xrs7O7w8fPfzWgd27i4aNMkfGT/kXiEXq4eFhPmvWfJuqqhKZkbm56YkjZ6pEokH1ypVr3Fu7W/syUlMrwYqxr1r01FNPxc6dt9Dzg/fe/n3Hjh2chgwI0WD56tXuhhKJ9LWXX2aCTfn//M//REEeVgNZk3zFihVeFRWNzd9/D43e+MJ76tlnZ8TGxXu9/fomKB2Tzm2nG2+80d/Zw8MAcJn8gSM/mTnF0hUrvH/ZsqXq9OnTTWBFmXzNKvWVV7KTnGeakpmFmPKrO2jOLDdqzuuHDYyaHAItqLujD9o9HkwfTKmvW0bWzrMo6m9fwddu/KqmesbkPK3lz9KHN744YcjaVzeS/7wnLwtLyFlNd2+lN5ddP2He2BuupmWP7dJLqCvB7pm75yX69d/PkLW1Cd31OwSrmhCdWOcJC5xihUjSQp+vj6J66Fiu/tetFLsOz0kPCo+5GDUUPECf3/7eFFcgpH/uKCATGx/dNjTMwsNnrOHl06erZlJbWy/97eVnKHjJC3qZSDD2Voj3jtnIjdpuT/GKLlU3tqF11u6iN69eMQKSrWZCYe40r29++22RUOiwfdvWhI8+Og9LMGHk+SsYxcP+YNTZEBEx22b9+nhbA4HAHFRQFaicjKioKIe/3XhjOCzhq4GABoRCw76HHnxq9003XeMHdrJ9//79lQxZvvfGG0UzlyyxfPjhf4U5OjrYJCdnnP7tt285ORUE55n33/9wwD333GMFc4VcrIYzTPL397fEhQ5u/eHbtPj4RGsgrHa0jWPwYQNWdM01N9pBZhWxe/v2gri4OCceFvPphx9mMvkYuzLGisKUo3v9G2/Eyn4+mJeWtpuxkRKSXs2H4LmPfGeZU3f7IBmYKqm93IpMrfrIb66KVEOF4MO78PDNdXr4nH0Vfz7mOhdh8ck3EcaG4y6FLfXSFMYWGlnMIY9gO6rMG9WscsCjVy8g1fS19+MWxuB31u/m6sL/5g2BdfAVl7vw+LYU9rdgqn+ljjrrksCaQX3IM9LpObELYbIxI8vFOJoawoq5IRbsm6teGl4e07Q2HOeQFVuDR/QcRJBgR7oXsUkH7X3lbqrOqgGrDMzxJxQBdkylUkt9D08/AWFBzuS08bXNTyYd3HcYAuqvLscyMzOPt7K/665b77xhw4vhe/bsrIWpAWyp0huBiGIXX7U44IH77/0NiKLnmWdOtYOy8d+wYUM4/hg7Npiyb19XpLc/z87JSdbb+wfj/TmEhV/1+++/mQ+zBud//fvfka++9FLmunXrnB0cXK23bduWC8QoXwJk9+KmTWFfffppAYM/9vp27PixWSZbJNj89rt/27V7V/Zbr72WNbadHYOS63znjTey/vnPx4I1mvZyaDDbSSBVQBvDp95uyLEO10KD6EzG5l3UVAadhMoSbj09ZGp9GrKoRTqR/sxlxDEgECF1XBFSp2Z0TY5BzqRWxGlZMnwol6MIJXYUuT6EKp8aj7BMbeZjbt1nZFSBQlZLp7cXc0As3RLBfl6I4td9rguOxJSWzkyOtReO0A00554srAMyQR3vJ0PCJtYx2EisqSSp7YJTs0afBBiLDkAho0dh8qu8g2kcBKdQvHs2QTpT8wwIezZKWR6l/fyrHqu6LEPBJJ4tAQEBPnfec/+Nn3zw7tuXC1mdnY1o27bv67766rM8mEo43nTTTTBmDxJLJHzV999+dXLlyr/5aDVUHGVTlJyc3QDD02D0MYaGMKq0tLDylnXXHw6NiRE+8MADTFA6+rJ/9tlndT9//33Z1m3b1zi4utq+8cYr6QxZsbmhaez48Ztv8m688Zaga6+91mrsem655RbXmIQE+1tvWrdLCq8YWM1bjm0fOWaU4rvvbs5ds+ZG33i4BdEf39Uj6kMvGZnDp9BPDCPOfg5ZmVkbYrOGz2FAN5k6ZujlbqJW2ZGSFz2yBu43fn00BO4mOlMD44Cd74R9uJql41pjVgchJIu7XtfDHpdScYJ66xm1CxMKT0QVGNGLjJvt8p4wuaKl66zhSRRUcvwoCfXAH4waNjC1g/N77JQW7ugHh3VOAjGl7pN2UsPuT608yrX5zAzGseOk/aZaKQYCrMoAe/7XK6MIC4jA9a5774344N03Pxs2H7giq2Vs3nPPPZcJlxvBxo2vLv35wIGy7777riwt7UTF8y/fFw7bKnyQRPv3/9bSMTRUC7naLVlZuW1gETmqavPGjSVp2dk9r775KosdNYK0hEuWrHA7nnw8TyqSquFrCBL/bAHy6nvhhecy/YODfaExBJtGIlBvkbC/kry8YUMmhP3t33zzWTHavGMRvubsyLNHzETi8ccfTlt109994uNtzdCiouKTvWD7DKk1X022btAQ9vQj0J+YaoqMKWtHBhmMW8ZZYFM5YiR+/PqZ47ryBEvGnV+OEyaY9k+MHAfaxicGyIVds+6FUQWZv5/iAHgB6dv7heuncdRxKUzLaeMeSAGJwRyExpIUsKY6AhsephzikbXHjIsCcQ6yhLPyDJ2pOTYBkzP2tRXSsc+0lLd3/Fy94DGYjEqsPLOXHf7VCoewIOOxuvPOe13eefPNHUAgWrX9FV4p7LCKYW1eesuK1Q5s6hMnTnS+s3lzHoTeIZBvSRn1BTWd2113/P3X0NAgG2ahPrLEU8eOVf7y44+dG156KYT1e/m116IyMlKb33n99bzvv/+q7L///rtaUCaC3NtfpMHEzc7u6dV58NlnP3MxmWjuLNu+ffvT7B/k5rHb0dGhLMs7LhQKtVRqPh8dHW1cs2aNo6Oj89YWLr4kcnQDQxN0paW5mUEB7YdfeSUWnvDyRLz5ics8vL0DsmfPtjl9+iQTCWEgLFQmlkrsS0lpAWmd7C9hzwXdodjKfHLeaj5oJ7SJZlWhfEuVQuQl0nFXRJsY0caZaCV9y8TGvIWurX7DP9t+zpD0NSLROc7b+M47uP80PG5lEnunKD8dZmVnYe3VFzcupDK0nl4sIcr4BHnSqiUI11K2QciQm4eGcZ+7GzIDYg6MLsGm+IhUgxL1PEI8YGYqfM3r4YrIF2vfmLEQCs7vlR6OZV7d/ugbjni+GwZ+vgtpCS/h5xd+0jX33LxP0arb+3RvMQdfReuVC19a9DZ8usxAwhd9sXvOJryychqd8o3n5iyhDOYSXFo7UFveERcOz8Bc6qtoU8yb0Yh8dTs3EFUIVEKNQPRBADQbKk0aY8/cQdj29QZ8lbOSkXL7cjHTKLhUmKqY0eJfqJ2Xw9zSmobS8xjafh4Gf3YGB5d+gDXvfsZn+jTi+2fRccBCbJwShz3zEvDCgrF0SjgLK96JQPKK/Xh19cfwaD+Jff0Os+Pf0Ffk3WtrdsOxuTcWDPCWAEuEehr21SLYOPakiclN5Kbk0xjWhYvajrKFSZgTP1nWf/HX0XzH19xoZfSXZMaxsKX+WhnlQvzOanMCngv4rk8XultxReiIxWjkQV/5Ny8hP6cM7u2Fi5e71AAegYRpv+v6827iAgp6n8PRta9hzYQ5unyBMP61Oo1HxGn4JKS/Lv/Bm7jxkYig9w0wWtCRNV3w27v6zcMYj+j3y1luQDfq0xWwj8pcqAg0NGobzt1szH/mddnkqIVvoUX4TBQXJGBqaG/miTnTpxcX/cjQYS/i5vmlmBH7NDrE+6PfhxtgXs+VY3SBSMwCDp4eKLl1Cqve7oXMQ3n4JG0O/fu/QAB/l4rE9fn9yhxTsMhDB0Yiz1hOpPATYv61hwCPiMuY4kzRR27AarW1LH828VksHrNEdkSMSf93ZqJJwMvcNLc5t9dpGuZEuVVDAo1PMWfQh7oOD/x0HEKHf0UXzsvwZbcRunxx89aWtZz/ECx5yof+vEog3DtHPDuba3o45XIFtJO8QfMzZwrwG1Iw/h0WjjZcP9rGJiTuocyrISZ1eFjB9IWfpsGv5wSsHN8RZfnWeHpOIr+nlKoSPIrUbnheza2tcPS3D7H0tRkY9dNktOz+ES4e+xrfx7+tfY28TkzeSmVuF+yd3QsDv1xL4OJL/2P36EvLnsCCu8dKIDu2V88KqRvGUGM+n+siAb/P6I+E6RsM2pqwez6dEQzBnL5euE/Z36h1mazvSj22WzXASMy9BefNmnM0B7P6K3DhnZ3zGJtgND1Z3OY31F4fIshMEdZOiEPiz+kG7/qbP/SC6CoGQ6U9M4/S9TLuTi+0oTuLsSjm6Vx5sd7GpFU3d6orTCHQWCKB1QdJK+ivewiPYadiy+wZPCW6gw4dTNH6+Rl0DDiORs5nsHXmL7Jvzi36s71ybPikDYru5sGigSnu36mEfX03xL57GE7Nx7LcBvz49ItQ06A6K7gEb7bbzAXcjvpebYiFynCPUacvMLDBoE8nSb2aO9fXPfTd9i4DCQyu4PIlRfhs17gPbebOEVgdYFkVo9R0xZ2rxEPesWgWVV+2Jxpp1skNrr7ByDn6rQRWIk7joK+2wKK+NzX8h+N82jp5CuYfZ4f+Hy2Bc4tJCIrfTs3+Q9gwbRlSF61ESqdivNlhFF3ozMfO70dg141NaFZozXcUo88HQQRW21B29xatCLpj3USFGmk3oA0Vddfy2TycXN9eUiFio5iYRcvxbxE+hL3TAyxra18Ke5vxBO1T0e1HJiH49uv5PQpyM7hgfKApczAoZ9Q8jBSOGynQl7Bg2wJ4ldSD8d1qlDKgSI/RvxLAjGL5d/m/hN/Sh8CKUSyLSS3qkIzSXNTYOHh2HEWqly5Dlq+QmdGvzWFZI2yf4Y0DixVqoO/EodSFWo6oca8gk8BjxdjxKLd8F1mMz/jS4sV830Cs+bAtCm9fg1k9MzknLy6YRMVTc7ogCsXdtNMod7OAFf0D13NuQFvWw9wgr/B9S+Qh0Kg5awgYe+LC0fFIXTMbKZvKIFyyDJjwLbzCPkCvd1KRIDYzkyup7SLK8uvVj6T5WBNkHbki80VE5fqOXTj/WyWw8oq1xcDJCQQmgTiT+BJSZi2WTgmFUXfEez9zfY9F8JDNOLJyu6xf+8/9u+cYo6C3VKA9l6TYeInnseNDSLVMwKXUyTiyLAVjls9hQIm71HFsjwwaV1s56velsWk1zm1U6tq7xzAYDFG7Uz86FJwkHQqK9tr1dSESj6L/ullSDamisIf0nuLd1YSut1Nx/VwuDk+LQZGjpSgux3v4N8tl0OKMnYkyT/eHJ6DVmt5cE4l0IZWPuPcjSalyfJJexC+/L9StEbE3Y0fPReOWw9AudhJStwog1Z9C9S2Yt66fLKdrkzfm9zQ4nVhSO6su9/qB0dY2NRNYVkmBg77gQJK9UQmoL86nlRT+zEQCEDWS14/DU1PHcDMM4QnMOFIqM7VFJJmYfesjRuHpT52tITUAyxjNQiNRWriP3kqzasqybaYrDAcVM66ImJSsH5N2gj3uNUDDAR1QkLNFFz1YFuCf1lGRKLp2vJbfLeWJsF+0de5EALqDk1Mug2FaN+qMnOQFLFAN/6hmPI4O5OJeRyquB1q2i+LmUBZyi+COJHWtcOjXRNlY7Mdfc/O0J+AJR+IPerYibQt9oms+RL8pAWQvPVn2EPKJjfOFdsROIrjfItjOdWSns51ENb+O2ID+uL07zyZiuINFL0XTuFzPiqSuO0l7t0lcfL+yTCgB1mY4uIURszVC8e2lXPhP0SdZe/okOy77FT6yB5FYBSmavfL3o/5ET/mYi9sHW6b2RvgLq8kPNDQo5ta2O2GPBvt/2EPzBjWyGCdRm0rjL5ECFL/K0bKrB2wd2xJwCNaZbbhY6AxyA2IcKQb4nJSThuvgFm6dFzpY3BiqUJoGLdQBK9HSxk9WUL+sP5EfMSCTdgELyqixDwESWda0LRfkM8XPtwkcvWIJmA/i0ArRLtNp7YljKcJH3Calrlg/dBo6jiG4epI6f55IdKEsKv6IOUla8QFc/IbQqeQg5qzlfVM09OjM8POrSbV1R9CwHgRYP8s6tk07E4k2xKltHC+miIGTSYGG4reJcUQOCTJP/BEn5uXfTqMHh+482W2sy699U1VxlVQ2Yxfct2N2sXwkAF1A7CyugXSseWW6zLNv0gtXTydh93z9eqjdjrgXzgJsaWN6N38pgewABA+MwdYv1shiTf0iuJ5NUFm5Wf7WRimysg/k3HgQ0UyrYdsq5XOPtg3QMrIzKfuduJDCdVkrde0ZwmC3jSk22SJzjYz7cvzVOLaGVPpWwzVS+QxdezMOQsWlewgZHAJ7N0eO43JGNDcsV6v5J7010jWgElrc/Jd1hGiUKf7z52iEG0Ng9RXzi/lIYFag22sR8AwcxVhtE3FqXT78erxHCH4As/rpgZUsyD+KPRn542pHmRUa35qT34pRox+giIgJBk+bytDj7iy7VFtdXpv5hZKkdUTOcWUAtQ+dWjTjbWfyx0m0wTOFX18nBPO/T18btBvQm5vHniyNsug820fBwsaCWHODrO4ZIuRs9XBk9RTcuZYNr4ih2mYJ3HoTw9xEo8rdEkA4NBtJGdEXBsBKW/jk1lRMCXRDwlfKwtHm0/cVN3g0MX2SpDa1+d27DmT4s/aU071vAKy0z68RgAmvtR7Byng18uzOxV6K5CWzSVlW0OC2r7YoKZ7+1FBPQ8r6Ry/y6Lc6wtX/bVw5NR1ZOw+QNa1HTspBV5/xkMjC9aMv/93ISjFsI+b1WLJ/r1OXbj3LV8KFwESjtiOSSiKQJDCqFUItaNhnpAItKfPKpEoDja3J6glgo1HvIFUzCi8umgIB1LTpm7gR+Pn5b7U/5dXN258BfL2QvPJ3g3yvMHeyREFI37HLIF/Yq/ab+C6cWgQg+7BCXbXu/hZja24xAFbaSqczC8miZ5EVbySzgocEcjyskZrwIwrzshmCfqS2KDr07SHH/FLyQXh1bQKPoDeRe3y2AbDSFr58Kh0ft3WlrNZwzWqfH1mWx6hEltAY2Wuz0P2TsVwbgTi5/U0IryLBQ0IYYdqdiOkAfOOt5RoW61j+H+Yk3fOIys4txT4ww/HV8wjwz8Ox2WBdm3ZusaRmC3BgyQldnrhx8okk0gSpuEMG+S5tAtgvV+YrAK72Q2dvyinLgN0/KnPhFxPN6OQ76UpKoUC1ZftPjoWr31u4dHybpETd2vek6Aa4ezVTstDabwiMd0aLrsq4a+s+wVVPYWlUVrKd09tvSBI2oPd05KVvwKlNS0j5vEdMViWfhwz9khTSKcquZiHm7TCygm4UCBrKj/QdEsJ0ukM2Vqio1rFdpJsRZ+9XKfMaRGBYzY+sojzIj/ZzTqTSvsKSN37VV+ddQEwsB70Y5w7oqRtRIHR4GF18qCgjGI1hE59nW6QMOTmaCjUpATMuutvs1zHZVuseFLaXFJFsVaiTFl1jydtnI+GzE3D+cRM8g99Cq86Ncdb5JlnSWG7yRCQmVqHvR33JpwN7Fy2W7YiN0iwwkkDFlhtXzZcxrFllIbGU4YJo1qszgb0TzTcUAFlTmezDALKpN3F8zcMLRZSpJmUnkrpCwcY+neMoYzmEvb8c4uY/wAUoNtYk+MU255i1IeCfKMs/+EcoNgbH/0CWJw1zv5pEMsOc43OHSMdOVzT82RaUH9EhXIUjxizbwW8ywf1792Br35iBdUlNFe7Cxumvy/IBffqzrQyO6X5Y2sbB5r4F6YUSGrT34tiNpDxkPDfAx/SfNk/X/pbpY8myL6DoYCLc2rxBDfFvuUFmP0Qliwp+sT3lgYRKGH7XSn49YrjuQFdHQ/HaKh4wcMjVjFNv6+hLysudHkBnkWr7BV1eGkB5YgMcWvJDrdr6W6diE367FYOd3Jeh9Gwdgyngnoklr//0qCZknoNvN86BLU/3BIsO7Dp9FCH5WSRi+sK1xWn2uRJlJQrFJgvwT2Ov7pJqvlf0mzZLXtvHteKhUkuc+v0jg3zxQ8j4hJeIvAyljrNPH66zTMzs+QqfKmP76sopPEEdj9t5JBKEGgqTnXsU+2eM9EVfYvusFJn3H/pDertWUqnU9Hv1PrFAMpI3KZi90oTukKvMGdZ8DL2RWiB5zURdDXXFSQmQwl+K0+Vpb6Le7ITmIR/iRvZKpG6kvlTnKD6ypDBbASSinAjCej7pc9RvHIzI0cO1VXXXpm0owyHFsXfRLl2euPH2D+ICJVbZn2CQL34YGw+Q2O/MXuU9bm0pNOTeO39guyzr1mEgN9cd5Bw5oNSlK53sg+vJ2van59TBJP/364CnpiqbZfzRqFVjWVb09+Sm09Jk4l6RJxeEGlfOG/atdXMvWNn68X0PADK2UF19jEAukKcqDsq7a/1tO/AzWNh6Iq1mIbn4xBGzpWDXjwrQu3zuKtUptqCJ/0BSC0+RHUzU6b9om6ErHqoAfM35u8EI272x9cunsXHqMOyaNYIA5yxad28ii9ZzdOKmj6Je1A4dsBIPkn77iRQFkdawD7RN8n3UmVOX4ejSFBxYfo2nVKVo06M3jd5fpDeP11FygxGUPHrR3a343mq6Qx6FjgM/pwCFwrha6fr5w2QVSA2REq6d3DoK6kSFg0v21c5GyPAOZFltiO331MrXEEDOIOXghS5Pv6DLNzI/SURAAflLobo87U33Mb3ph+01Apbvkbw4E+K3puoeqfYj2iI05l/KY/wgGn+PQGVpMs6W5spnGh6UiON8v5bK/AvZXPrvp+T8m1g24DMgeZlhv3WN8qZaU8j1W8gN3o1U5uc8lV5DFYJVuiJubXqSgjEmRbdWl/eom7YDokh5U50i+5TymOKKohsrKWekPDloFO5cTsSRpVcMqvr37Inyu/k4vlahDrUPq6rdeWuEQrKKtZOIzN4y4kUebu3CgV9OonlgU8pJg+gEciOLqXVFD6ycz4MxFU+7FaJDPHD06sF1kYntv53RlfsP3RCc1iQhT5J8Pu23Mshvis0pEsMmyKsKtJ86Pg7pW8UmVtLODXsRGJ/KRfolOhP73L62ESaVlmjcfji6vjydJ3iHseWjsbKwd6c4yiDol8hIkSNp20hedoCnUCUI6DMMe+Yv02bzasTJ6EUZ0Ulcd8islU+A1aUXF34pctMPGuSLH216RXGizhCwnJfPWnSKJIA6LEKHkeY14UlcBCd7Lw8X7urqXjq5nCdz47mJA+hOZ4IuP3XDRkS9MQRxb83iMfl4GFkV0gjQBR2H9SM1NIkUWQpSlmfoyosbr2Aq03JYc04oWLr2w6tp8+HSqg/CXlzKgX0HxeocNHZpSb9KU0gV9qAMZRw2Td3OI3pP6hJ1IhDgxq/BYqKdG9lrKA8aIn0wXTz+MGYPm8BvMA2lgLgf9vy4rfar0T7+DOVErWSeUKq0qm+KvDM7DcrkHbnCsdpGtjmKrKALT2qvwTssDtfOHZQyHUvKK4X+jYnFJNy5sR77flyFXhMGU85DV4iqBNmWppxKiZZj8NSb40hh/kzgXUrKzptRZ2YTcRQj94TYAPrkHTqIMqHLKLmfrM/knbHpIALZUlxMM6Qcjv+ayLiAtykPHIS1ExXh/fXMrex3FlqEzaOqA4M2XN0Nk2oGOxkxiuM1kZThdmya/L5s365pPIH9UWU91LwxaclOjAz+jBBGqJNwzInERDIyWUlA+Az6Tv6OVO1bKLh7FWb3Xbku4yiT+4gyHCp0agzXc02T8nJ6223kjcyn6stg7q2rVOXRb3JRwLdHFJFLKcfIEv69/LmmCdFrkhmVp3IPnEVBQQXlg5Rl5h7C9VrRxI8uXYe4D98kILMmwp2lrSavQgncxCIaV89tkeoxtR9qqs9THFNC4Pwerp3Ohon6Cuxb+tF/3TSKaJyROHeoLO7iG06EbEH/9YYI+RQjsvf+N9WMjKi6QC+oN3PUcG3dlSzjToSEe3DOqBZhoiAlITIxMrrPvXiObSrUWO2+1OFeD7BE+F9T8ypqKc/Euo/26tqqZmh6I9O71KxNxsIvZuvy5Q0t1rdPH44e4+fSE+kvRJQ3mG1EjKzCmR1fE+pPoi5HsYxDaGUTTIU3ao5TR6t2Evovty6uh41DNFUgnCGcrYnk3sGJGMyHwHMu1QJqf6wR/Y8z6k7aLrKil2s3hYZNXKlf5c+Q4nOYX4EmrbyJpSkHOjZJlnMvDiBL44Jt30w0qHeQ8rmuL2/h4EbzxFMPaHZ+v4xksis37Qd0IXySC1oAOWroV1JN4cgqbuQvDNoRP3wiAsliHsW1/YaATDxbN2kzBZiv8fRxMvp/cojjRdag2ppUzRXqh/WRz0W5iKEduKhKkb1fYWNFnkhJFI77RWVwXFTE9OxPrRQx2p8HAv/iqd9c7PnBECiIYka4TMqCACvemNSE0PDPxrFN+nnWNnX93Gp5Aunbqx3svM0YnduBc6Cw5Kb1StjfXBZVY/0778gqdi5duOnOI3WBwkb/Pmcp7D0jGGPxQwIWsnLV91muHjdWFnZ92wcHftQjn2DqODX0aE11k4106HZPtif+CErRMyhAGlLrQ8cpjwsKivkdy0mZDEMTXy9SxFlUkblNMU08+nz4E7q+SgpGdZPvNSY7p0HWoU9w4LdPqUdUjtBhLSkwdqD8xnCDn993Fneu74BdY57sHtPP/9r3E9Co2Tg4eryH6Lfp/wp8j1E9votupbN24ijZYcO1qfsE3Y266hz72gqZe9/jAVaOLt+2iT0BOy051PfQ89+/GFKe7LtF/SoqJMfBo7MxORDq8P22UldX3BxZnYIOgw6RAm6Pc4mGMuROQ3wlQso9utmgjvghCI4jK96gasUXGDiNSEJVyNyGpJQzsX9BLBJ/OizrBPSOpJD/PG5kcp0+kE4lbEb4031JaYfgfuFVjjMRFmXVPd/dzDFSCByliiW/8QiqLsRTPPBAI3X7+X+CmDJoUbJ+0AAAAABJRU5ErkJggg==";

const BASE_RUN_HOURS_PER_DAY = 10.75;

const presets = {
  Lite: {
    current: { lfPerPiece: 4, piecesPerFixture: 4, fixturesPerCycle: 10, lfPerCycle: 160, cycleMinutes: 9 + 4 / 60, cyclesPerHour: 6, lfPerHour: 960, lfPerDay: 10320 },
    nested: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 11 + 42 / 60, cyclesPerHour: 4, lfPerHour: 1280, lfPerDay: 13760 },
    doubleBlade: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 8 + 23 / 60, cyclesPerHour: 7, lfPerHour: 2240, lfPerDay: 24080 },
    nestedNoEndCut: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 4 + 9 / 60, cyclesPerHour: 12, lfPerHour: 3840, lfPerDay: 41280 },
  },
  Regular: {
    current: { lfPerPiece: 4, piecesPerFixture: 4, fixturesPerCycle: 10, lfPerCycle: 160, cycleMinutes: 11 + 5 / 60, cyclesPerHour: 5, lfPerHour: 800, lfPerDay: 8600 },
    nested: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 14 + 19 / 60, cyclesPerHour: 4, lfPerHour: 1280, lfPerDay: 13760 },
    doubleBlade: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 10 + 30 / 60, cyclesPerHour: 5, lfPerHour: 1600, lfPerDay: 17200 },
    nestedNoEndCut: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 5 + 21 / 60, cyclesPerHour: 10, lfPerHour: 3200, lfPerDay: 34400 },
  },
  Plus: {
    current: { lfPerPiece: 4, piecesPerFixture: 4, fixturesPerCycle: 10, lfPerCycle: 160, cycleMinutes: 11 + 5 / 60, cyclesPerHour: 5, lfPerHour: 800, lfPerDay: 8600 },
    nested: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 14 + 19 / 60, cyclesPerHour: 4, lfPerHour: 1280, lfPerDay: 13760 },
    doubleBlade: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 10 + 30 / 60, cyclesPerHour: 5, lfPerHour: 1600, lfPerDay: 17200 },
    nestedNoEndCut: { lfPerPiece: 4, piecesPerFixture: 8, fixturesPerCycle: 10, lfPerCycle: 320, cycleMinutes: 5 + 21 / 60, cyclesPerHour: 10, lfPerHour: 3200, lfPerDay: 34400 },
  },
};

const fmt0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const fmt1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function formatClock(minutesDecimal) {
  const totalSeconds = Math.max(0, Math.round(minutesDecimal * 60));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function Card({ title, children, blue = false }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${blue ? "border-sky-200 bg-sky-50" : "border-slate-200 bg-white"}`}>
      {title ? <h3 className={`mb-4 text-lg font-semibold ${blue ? "text-sky-950" : "text-slate-900"}`}>{title}</h3> : null}
      {children}
    </div>
  );
}

function MetricCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-sky-700">{title}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
      {subtitle ? <div className="mt-1 text-sm text-slate-500">{subtitle}</div> : null}
    </div>
  );
}

function DetailBox({ label, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-900">{value}</div>
      {helper ? <div className="mt-1 text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}

function NumberInput({ label, value, onChange, step = 1 }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function RangeInput({ label, value, onChange, min, max, step = 1, helper, suffix = "" }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-sky-900">{fmt0.format(value)}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sky-600"
      />
      {helper ? <div className="text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}

export default function DynamaxProductionScenarioTool() {
  const [product, setProduct] = useState("Lite");
  const [processMode, setProcessMode] = useState("current");
  const [tableUtilizationPct, setTableUtilizationPct] = useState(100);
  const [downtimePct, setDowntimePct] = useState(10);
  const [headcount, setHeadcount] = useState(3);
  const [runHoursPerDay, setRunHoursPerDay] = useState(BASE_RUN_HOURS_PER_DAY);
  const [operatingDaysPerYear, setOperatingDaysPerYear] = useState(211);
  const [overtimeHoursPerWeek, setOvertimeHoursPerWeek] = useState("0");
  const [dailyGoalLF, setDailyGoalLF] = useState(10792);
  const [annualGoalLF, setAnnualGoalLF] = useState(2500000);
  const [lastYearLF, setLastYearLF] = useState(1594213);

  const selectedPreset = presets[product][processMode];
  const currentPreset = presets[product].current;

  const results = useMemo(() => {
    const overtimePerDay = Number(overtimeHoursPerWeek) / 5;
    const effectiveRunHoursPerDay = runHoursPerDay + overtimePerDay;
    const utilizationFactor = tableUtilizationPct / 100;
    const downtimeFactor = clamp((110 - downtimePct) / 100, 0, 2);
    const requiredHeadcount = 2 + ((tableUtilizationPct - 50) / 50);
    const staffingFactor = clamp(headcount / requiredHeadcount, 0, 1);

    const project = (preset) => {
      const adjustedLfPerHour = preset.lfPerHour * utilizationFactor * downtimeFactor * staffingFactor;
      const adjustedLfPerDay = adjustedLfPerHour * effectiveRunHoursPerDay;
      const adjustedAnnualLF = adjustedLfPerDay * operatingDaysPerYear;
      return {
        adjustedLfPerHour,
        adjustedLfPerDay,
        adjustedAnnualLF,
      };
    };

    const selectedScenario = project(selectedPreset);
    const currentScenario = project(currentPreset);

    return {
      overtimePerDay,
      effectiveRunHoursPerDay,
      requiredHeadcount,
      staffingFactor,
      selectedScenario,
      currentScenario,
      improvementVsCurrentPerDay: selectedScenario.adjustedLfPerDay - currentScenario.adjustedLfPerDay,
      improvementVsCurrentPerYear: selectedScenario.adjustedAnnualLF - currentScenario.adjustedAnnualLF,
      gapToDailyGoal: selectedScenario.adjustedLfPerDay - dailyGoalLF,
      gapToAnnualGoal: selectedScenario.adjustedAnnualLF - annualGoalLF,
      gapToLastYear: selectedScenario.adjustedAnnualLF - lastYearLF,
      annualVsLastYearPct: lastYearLF > 0 ? (selectedScenario.adjustedAnnualLF / lastYearLF) * 100 : 0,
    };
  }, [
    selectedPreset,
    currentPreset,
    tableUtilizationPct,
    downtimePct,
    headcount,
    runHoursPerDay,
    operatingDaysPerYear,
    overtimeHoursPerWeek,
    dailyGoalLF,
    annualGoalLF,
    lastYearLF,
  ]);

  const processModeLabel = {
    current: "Current",
    nested: "Nested",
    doubleBlade: "Double Blade",
    nestedNoEndCut: "Nested / No End Cut",
  }[processMode];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-slate-50 to-white p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-sky-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img src={LOGO} alt="WAVE logo" className="h-16 w-auto object-contain" />
              <div>
                <div className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">Executive Scenario Planner</div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">WAVE ALP Dynamax CNC Production Projection Tool</h1>
                <p className="mt-2 max-w-4xl text-sm text-slate-600">
                  Built from the provided production sheets using exact preset LF per hour and LF per day values for each process mode, then scaled with scenario inputs for utilization, downtime, runtime, and staffing.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-sky-700 px-3 py-1 text-white">{product}</span>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-900">{processModeLabel}</span>
              <span className="rounded-full border border-sky-200 bg-white px-3 py-1 text-slate-700">Headcount: {fmt0.format(headcount)}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[390px,1fr]">
          <div className="space-y-6">
            <Card title="Validated Process Presets" blue={true}>
              <div className="space-y-4">
                <SelectInput
                  label="Product Family"
                  value={product}
                  onChange={setProduct}
                  options={[
                    { value: "Lite", label: "Lite" },
                    { value: "Regular", label: "Regular" },
                    { value: "Plus", label: "Plus" },
                  ]}
                />
                <SelectInput
                  label="Process Mode"
                  value={processMode}
                  onChange={setProcessMode}
                  options={[
                    { value: "current", label: "Current" },
                    { value: "nested", label: "Nested" },
                    { value: "doubleBlade", label: "Double Blade" },
                    { value: "nestedNoEndCut", label: "Nested / No End Cut" },
                  ]}
                />
                <div className="grid grid-cols-2 gap-4">
                  <DetailBox label="LF / Cycle" value={fmt0.format(selectedPreset.lfPerCycle)} helper="Exact sheet value" />
                  <DetailBox label="Cycle Time" value={formatClock(selectedPreset.cycleMinutes)} helper="Exact sheet value" />
                  <DetailBox label="Cycles / Hour" value={fmt0.format(selectedPreset.cyclesPerHour)} helper="Exact sheet value" />
                  <DetailBox label="LF / Hour" value={fmt0.format(selectedPreset.lfPerHour)} helper="Exact sheet value" />
                </div>
                <div className="rounded-2xl border border-sky-200 bg-white p-4 text-sm text-slate-600">
                  Baseline LF/day from the sheet for this mode is <span className="font-semibold text-slate-900">{fmt0.format(selectedPreset.lfPerDay)}</span>, based on <span className="font-semibold text-slate-900">{fmt1.format(BASE_RUN_HOURS_PER_DAY)}</span> runtime hours per day.
                </div>
              </div>
            </Card>

            <Card title="Executive Planning Inputs">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <NumberInput label="Operating Days / Year" value={operatingDaysPerYear} onChange={setOperatingDaysPerYear} />
                <NumberInput label="Run Hours / Day" value={runHoursPerDay} onChange={setRunHoursPerDay} step={0.25} />
                <NumberInput label="Headcount" value={headcount} onChange={setHeadcount} />
                <SelectInput
                  label="Overtime / Week"
                  value={overtimeHoursPerWeek}
                  onChange={setOvertimeHoursPerWeek}
                  options={[
                    { value: "0", label: "0 hrs" },
                    { value: "2", label: "2 hrs" },
                    { value: "8", label: "8 hrs" },
                    { value: "10", label: "10 hrs" },
                    { value: "16", label: "16 hrs" },
                  ]}
                />
                <NumberInput label="Daily Goal LF" value={dailyGoalLF} onChange={setDailyGoalLF} />
                <NumberInput label="Annual Goal LF" value={annualGoalLF} onChange={setAnnualGoalLF} />
                <div className="md:col-span-2">
                  <NumberInput label="Last Year Actual LF" value={lastYearLF} onChange={setLastYearLF} />
                </div>
              </div>
            </Card>

            <Card title="Scenario Multipliers" blue={true}>
              <div className="space-y-6">
                <RangeInput
                  label="Relative Table Utilization"
                  value={tableUtilizationPct}
                  onChange={setTableUtilizationPct}
                  min={50}
                  max={100}
                  step={5}
                  suffix="%"
                  helper="100% keeps the selected preset at full value. Lower settings scale the validated preset down."
                />
                <RangeInput
                  label="Downtime"
                  value={downtimePct}
                  onChange={setDowntimePct}
                  min={0}
                  max={30}
                  step={1}
                  suffix="%"
                  helper="10% is neutral because the provided runtime sheet already bakes in normal daily losses around that level."
                />
                <div className="rounded-2xl border border-sky-200 bg-white p-4 text-sm text-slate-600">
                  Required headcount at the selected utilization is <span className="font-semibold text-slate-900">{fmt1.format(results.requiredHeadcount)}</span>. Current staffing support factor is <span className="font-semibold text-slate-900">{fmt1.format(results.staffingFactor * 100)}%</span>.
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Adjusted LF / Hour" value={fmt0.format(results.selectedScenario.adjustedLfPerHour)} subtitle="Validated preset scaled by scenario multipliers" />
              <MetricCard title="Adjusted LF / Day" value={fmt0.format(results.selectedScenario.adjustedLfPerDay)} subtitle={`${fmt1.format(results.effectiveRunHoursPerDay)} effective runtime hrs/day`} />
              <MetricCard title="Adjusted Annual LF" value={fmt0.format(results.selectedScenario.adjustedAnnualLF)} subtitle={`${fmt0.format(operatingDaysPerYear)} operating days/year`} />
              <MetricCard title="Last Year Actual LF" value={fmt0.format(lastYearLF)} subtitle={`${fmt1.format(results.annualVsLastYearPct)}% of last year actual`} />
            </div>

            <Card title="Executive Summary" blue={true}>
              <div className={`rounded-2xl p-5 ${results.gapToAnnualGoal >= 0 ? "bg-emerald-50" : "bg-rose-50"}`}>
                <div className="text-sm text-slate-500">Annual Goal vs Projection</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight">{fmt0.format(annualGoalLF)} LF target</div>
                <div className={`mt-2 text-base font-medium ${results.gapToAnnualGoal >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {results.gapToAnnualGoal >= 0
                    ? `Projected to exceed goal by ${fmt0.format(results.gapToAnnualGoal)} LF`
                    : `Projected short by ${fmt0.format(Math.abs(results.gapToAnnualGoal))} LF`}
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
                <DetailBox label="Validated LF / Day" value={fmt0.format(selectedPreset.lfPerDay)} helper="Exact sheet baseline" />
                <DetailBox label="Adjusted LF / Day" value={fmt0.format(results.selectedScenario.adjustedLfPerDay)} helper="Scenario output" />
                <DetailBox label="Gap to Daily Goal" value={fmt0.format(results.gapToDailyGoal)} helper={`${results.gapToDailyGoal >= 0 ? "Ahead of" : "Short of"} ${fmt0.format(dailyGoalLF)}`} />
                <DetailBox label="Last Year Actual" value={fmt0.format(lastYearLF)} helper="2025 actual output" />
                <DetailBox label="Projection vs Last Year" value={fmt0.format(results.gapToLastYear)} helper={`${results.gapToLastYear >= 0 ? "Above" : "Below"} last year`} />
                <DetailBox label="OT Added / Day" value={fmt1.format(results.overtimePerDay)} helper={`${overtimeHoursPerWeek} hours/week selected`} />
              </div>
            </Card>

            <Card title="Current vs Selected Comparison">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="pb-3 pr-4 font-medium">Metric</th>
                      <th className="pb-3 pr-4 font-medium">Current</th>
                      <th className="pb-3 pr-4 font-medium">Selected</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-800">
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4">Validated LF / Hour</td>
                      <td className="py-3 pr-4">{fmt0.format(currentPreset.lfPerHour)}</td>
                      <td className="py-3 pr-4">{fmt0.format(selectedPreset.lfPerHour)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4">Validated LF / Day</td>
                      <td className="py-3 pr-4">{fmt0.format(currentPreset.lfPerDay)}</td>
                      <td className="py-3 pr-4">{fmt0.format(selectedPreset.lfPerDay)}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 pr-4">Adjusted LF / Day</td>
                      <td className="py-3 pr-4">{fmt0.format(results.currentScenario.adjustedLfPerDay)}</td>
                      <td className="py-3 pr-4">{fmt0.format(results.selectedScenario.adjustedLfPerDay)}</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Adjusted Annual LF</td>
                      <td className="py-3 pr-4">{fmt0.format(results.currentScenario.adjustedAnnualLF)}</td>
                      <td className="py-3 pr-4">{fmt0.format(results.selectedScenario.adjustedAnnualLF)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Leadership Notes">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DetailBox label="Presets" value="Validated" helper="LF/hour and LF/day come directly from the provided cross-cut data table." />
                <DetailBox label="Confidence" value="High" helper="Scenario output is anchored to exact sheet presets instead of pure cycle-time math." />
                <DetailBox label="Risk Area" value="Staffing" helper="Headcount below the required threshold reduces scenario output automatically." />
                <DetailBox label="Best Use" value="Decision Support" helper="Ideal for showing mode changes, projection vs target, and projection vs last year." />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
