from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from . import views

urlpatterns = [
    path('token', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

    path('hello', views.SendChatMessage.as_view(), name='hello'),
    path('register', views.RegisterView.as_view(), name='register'),
    path('view_profile', views.WhoAmIView.as_view(), name='view_profile'),
    path('get_profile', views.GetProfileView.as_view(), name='get_profile'),
    path('update_profile', views.UpdateProfileView.as_view(), name='update_profile'),
    path('update_profile_stats', views.UpdateProfileStats.as_view(), name='update_profile_stats'),
    path('update_profile_rating', views.UpdateProfileRating.as_view(), name='update_profile_rating'),
    path('send_message', views.SendChatMessage.as_view(), name='send_message'),
    path('send_game_state', views.SendGameState.as_view(), name='send_game_state'),
    path('send_game_settings', views.SendGameSettings.as_view(), name='send_game_settings'),
    path('end_game', views.EndGame.as_view(), name='end_game'),
    path('get_messages', views.GetChatMessages.as_view(), name='get_messages'),
    path('get_conected_user_count', views.GetConnectedUsersCount.as_view(), name='get_conected_user_count'),


    path('get_username', views.GetUsername.as_view(), name='get_username'),
    path('statistic', views.GetAllScores.as_view(), name='statistic'),
    path('grade', views.StatisticGradeUpdate.as_view(), name='grade'),
]
