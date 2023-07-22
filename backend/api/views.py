import json
import traceback

import socketio

from django.contrib.auth.models import User
from rest_framework import permissions, serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from api.models import Profile
from api.models import ProfileStats
from api.models import ChatMessage


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)


class WhoAmIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        try:
            username = user.username
            content = {'username': username}
            return Response(content)
        except Exception as e:
            print('Invalid token:', str(e))


class GetProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        try:
            user_profile = Profile.objects.get(user=user)
            user_stats = ProfileStats.objects.get(user_profile=user_profile)
            username = user.username
            password = user.password
            first_name = user.first_name
            last_name = user.last_name
            email = user.email
            country = user_profile.country
            birth_date = user_profile.birth_date
            image_path = user_profile.image.url if user_profile.image else None
            if (user_stats.times_graded==0):
                user_stats.times_graded=1
            grade=(user_stats.total_grades)/(user_stats.times_graded)
            content = {
                'username': username,
                'password': password,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'country': country,
                'birth_date': birth_date,
                'image_path': image_path,
                'games_won': user_stats.games_won,
                'games_lost': user_stats.games_lost,
                'grade':grade,
                'total_grades': user_stats.total_grades,
                'times_graded': user_stats.times_graded,
            }
            return Response(content)
        except Exception as e:
            print('Invalid token:', str(e))

class StatisticGradeUpdate(APIView):
    def post(self, request):
        user = request.user
        data = request.data
        grade = int(data['grade'])
        try:
            user_profile = user.profile
            user_stats = ProfileStats.objects.get(user_profile=user_profile)
            user_stats.times_graded += 1
            user_stats.total_grades += grade
            user_stats.save()


        except Exception as e:
            error_message = traceback.format_exc()
            return Response({'error': 'Problem with grade',
                             'error_details': error_message})

class UpdateProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        data = request.data

        username = data['username']
        password = data['password']
        new_password = data['new_password']
        retype_new_password = data['retype_new_password']

        image = request.FILES.get('image')

        first_name = data['first_name']
        last_name = data['last_name']
        email = data['email']
        country = data['country']
        birth_date = data['birth_date']

        try:
            user.username = username
            user.first_name = first_name
            user.last_name = last_name
            user.email = email
            user.save()

            user_profile = user.profile

            if image:
                user_profile.image.save(image.name, image)

            user_profile.country = country
            user_profile.birth_date = birth_date
            user_profile.save()

            if user.check_password(password):
                if new_password == retype_new_password:
                    if len(new_password) > 6:
                        user.set_password(new_password)
                        user.save()
                        return Response({'success': 'User updated!'})
                    else:
                        return Response(
                            {'error': 'New password should be at least 6 characters long! Password not updated!'})
                else:
                    return Response(
                        {'error': 'New password and confirmed password not matching! Password not updated!'})
            else:
                return Response({'error': 'Incorrect old password! Password not updated!'})

        except Exception as e:
            error_message = traceback.format_exc()
            return Response({'error': 'Something went wrong with updating an account!',
                             'error_details': error_message})


class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']
        retype_password = data['retype_password']

        first_name = data['first_name']
        last_name = data['last_name']
        email = data['email']
        country = data['country']
        birth_date = data['birth_date']

        try:
            if password == retype_password:
                if User.objects.filter(username=username).exists():
                    return Response({'error': 'Username already exists!'})
                else:
                    if len(password) < 6:
                        return Response({'error': 'Password must be at least 6 characters  long!'})
                    else:
                        user = User.objects.create_user(username=username, password=password, first_name=first_name,
                                                        last_name=last_name, email=email)
                        user.save()

                        user_profile = Profile.objects.get(user=user)
                        user_profile.country = country
                        user_profile.birth_date = birth_date

                        user_profile.save()

                        return Response({'success': 'User created successfully!'})
            else:
                return Response({'error': 'Passwords do not match!'})
        except Exception as e:
            error_message = traceback.format_exc()
            return Response({'error': 'Something went wrong with registering an account!',
                             'error_details': error_message})


class UpdateProfileStats(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        data = request.data

        winner_username = data['winnerUsername']
        loser_username = data['loserUsername']

        try:
            request_username = user.username

            winner_user = User.objects.get(username=winner_username)
            loser_user = User.objects.get(username=loser_username)

            winner_user_profile = winner_user.profile
            loser_user_profile = loser_user.profile

            winner_user_stats = ProfileStats.objects.get(user_profile=winner_user_profile)
            loser_user_stats = ProfileStats.objects.get(user_profile=loser_user_profile)

            if request_username == winner_username:
                winner_user_stats.games_won += 1
                winner_user_stats.games_played += 1
                winner_user_stats.save()

            else:
                loser_user_stats.games_lost += 1
                loser_user_stats.games_played += 1
                loser_user_stats.save()

            return Response({'success': 'User stats updated successfully!'})
        except Exception as e:
            error_message = traceback.format_exc()
            return Response({'error': 'Something went wrong with updating user profile stats',
                             'error_details': error_message})


class UpdateProfileRating(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data

        username_to_be_rated = data['playerToBeRated']
        grade = int(data['grade'])

        try:
            user_to_be_rated = User.objects.get(username=username_to_be_rated)
            user_to_be_rated_profile = user_to_be_rated.profile
            user_to_be_rated_stats = ProfileStats.objects.get(user_profile=user_to_be_rated_profile)

            user_to_be_rated_stats.total_grades += grade
            user_to_be_rated_stats.times_graded += 1
            user_to_be_rated_stats.save()

            return Response({'success': 'User grade updated successfully!'})

        except Exception as e:
            error_message = traceback.format_exc()
            return Response({'error': 'Something went wrong with updating user profile grade',
                             'error_details': error_message})


sio = socketio.Server(cors_allowed_origins='*')

room_users = {}


@sio.event
def connect(sid, environ):
    pass


@sio.event
def join(sid, message):
    room = message['room']
    sio.enter_room(sid, message['room'])
    username = message['username']
    if room not in room_users:
        room_users[room] = []
    room_users[room].append({
        'sid': sid,
        'username': username,
    })


def leave(sid, message):
    room = message['room']
    sio.leave_room(sid, message['room'])
    if room in room_users:
        user = next(filter(lambda u: u['sid'] == sid, room_users[room]))
        room_users[room].remove(user)


@sio.event
def disconnect(sid):
    for room, users in room_users.items():
        user = next(filter(lambda u: u['sid'] == sid, users))
        users.remove(sid)


@sio.event
def hello(self, message):
    sio.emit('message', {'data': message['data']}, room=message['room'])


class SendChatMessage(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        username = request.user.username
        room = request.data.get('room', '')
        message = request.data.get('message', '')

        try:
            sio.emit('message', {'data': message, 'username': username}, room=room)
            chat_message = ChatMessage(room=room, sender=request.user, content=message)
            chat_message.save()
            return Response({'success': 'Message sent!'})
        except Exception as e:
            error_message = traceback.format_exc()
            return Response({'error': 'Failed to send message.', 'error_details': error_message})


class SendGameState(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        username = request.user.username
        room = request.data.get('room', '')
        game_state = request.data.get('gameState', None)

        if game_state is not None:
            game_state = json.loads(game_state)

            allPoints = game_state.get('allPoints', [])
            occupiedPoints = game_state.get('occupiedPoints', [])
            trianglePoints = game_state.get('trianglePoints', [])
            allTriangles = game_state.get('allTriangles', [])

            try:
                sio.emit('game_state', {'gameState': game_state}, room=room)
                return Response({'success': 'Game state sent!'})
            except Exception as e:
                error_message = str(e)
                return Response({'error': 'Failed to send game state.', 'error_details': error_message})

        return Response({'error': 'Invalid game state.'})


class SendGameSettings(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        username = request.user.username
        room = request.data.get('room', '')
        game_settings = request.data.get('gameSettings', None)

        if game_settings is not None:
            game_settings = json.loads(game_settings)

            try:
                sio.emit('game_settings', {'gameSettings': game_settings}, room=room)
                return Response({'success': 'Game settings sent!'})
            except Exception as e:
                error_message = str(e)
                return Response({'error': 'Failed to send game settings.', 'error_details': error_message})

        return Response({'error': 'Invalid game settings.'})


class GetConnectedUsersCount(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        room = request.query_params.get('room', '')

        if room in room_users:
            connected_users_count = len(room_users[room])
        else:
            connected_users_count = 0

        try:
            sio.emit('connectedUsersCount', {'count': connected_users_count}, room=room)
            return Response({'success': 'Connected users count sent!'})
        except Exception as e:
            error_message = str(e)
            return Response({'error': 'Failed to send connected users count.', 'error_details': error_message})


class EndGame(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        global loserUsername
        username = request.user.username

        room = request.data.get('room', '')
        payload = request.data.get('payload', None)
        users = room_users[room]
        for player in users:
            if player['username'] != username:
                loserUsername = player['username']

        if payload is not None:
            payload = json.loads(payload)
            payload['winnerUsername'] = username
            payload['loserUsername'] = loserUsername

            try:
                sio.emit('end_game', {'payload': payload}, room=room)
                return Response({'success': 'End game signal sent!'})
            except Exception as e:
                error_message = str(e)
                return Response({'error': 'Failed to send end game signal.', 'error_details': error_message})

        return Response({'error': 'Invalid end game payload.'})


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ('room', 'sender', 'sender_username', 'content', 'timestamp')

    def get_sender_username(self, obj):
        sender_id = obj.sender.id
        try:
            sender = User.objects.get(id=sender_id)
            return sender.username
        except User.DoesNotExist:
            return None


class GetChatMessages(APIView):
    def get(self, request):
        try:
            room = request.query_params.get('room')
            chat_messages = ChatMessage.objects.filter(room=room)
            serializer = ChatMessageSerializer(chat_messages, many=True)
            return Response(serializer.data)
        except Exception as e:
            error_message = traceback.format_exc()
            return Response({'error': 'Failed to get messages.', 'error_details': error_message})


class GetUsername(APIView):
    def get(self, request):
        try:
            data = request.data
            user_id = data['user_id']
            user = User.objects.get(id=user_id)
            return Response(user.username)
        except Exception as e:
            error_message = traceback.format_exc()
            return Response({'error': 'Failed to get messages.', 'error_details': error_message})


class GetAllScores(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            users = User.objects.all()
            profiles = []
            for user in users:
                user_profile = Profile.objects.get(user=user)
                user_stats = ProfileStats.objects.get(user_profile=user_profile)
                username = user.username
                grade = user_stats.times_graded
                score = user_stats.total_grades
                wins = user_stats.games_won
                image_path = user_profile.image.url if user_profile.image else None
                content = {
                    'username': username,
                    'image_path': image_path,
                    'games_won': wins,
                    'grade': grade,
                    'score': score,
                }
                profiles.append(content)
            return JsonResponse(profiles, safe=False)
        except Exception as e:
            print('Error:', str(e))
            error_message = traceback.format_exc()
            return Response({'error': 'Failed to get messages.', 'error_details': error_message})
