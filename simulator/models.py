from django.db import models

# Create your models here.

LIGHT_GROUPS = [
    ("G1", 'G1'),
    ("G2", "G2")
]

class Light(models.Model):
    light_id = models.AutoField(primary_key=True)
    light_name = models.TextField()
    light_group = models.CharField(max_length=2, choices=LIGHT_GROUPS)
