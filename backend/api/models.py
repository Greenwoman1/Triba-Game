from django.db import models

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver




class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    country = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='profile_images', blank=True, null=True)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class ProfileStats(models.Model):
    user_profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    games_played = models.IntegerField(null=False, default=0)
    games_won = models.IntegerField(null=False, default=0)
    games_lost = models.IntegerField(null=False, default=0)
    total_grades = models.BigIntegerField(null=False, default=0)
    times_graded = models.IntegerField(null=False, default=0)

@receiver(post_save, sender=Profile)
def create_profile_stats(sender, instance, created, **kwargs):
    if created:
        ProfileStats.objects.create(user_profile=instance)

class ChatMessage(models.Model):
    room = models.CharField(max_length=100)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)



