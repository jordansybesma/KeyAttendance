# Generated by Django 2.1.5 on 2019-02-01 01:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('key', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='attendanceitems',
            name='num_value',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='attendanceitems',
            name='str_value',
            field=models.TextField(blank=True, null=True),
        ),
    ]