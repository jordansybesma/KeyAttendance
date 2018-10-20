from django.db import models

# Create your models here.
class Youth(models.Model):
	name = models.CharField(max_length=30)
	key = models.BooleanField(default=True)


	def __str__(self):
		"""A string representation of the model."""
		return self.name #('%s key? %b', self.name, self.key)
