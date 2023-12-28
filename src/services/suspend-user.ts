import renderDelete from '../remote/activitypub/renderer/delete';
import { renderActivity } from '../remote/activitypub/renderer';
import { deliver } from '../queue';
import config from '../config';
import deleteFollowing from '../services/following/delete';
import { User } from '../models/entities/user';
import { Users, Followings, Notifications } from '../models';
import { Not, IsNull, Brackets } from 'typeorm';
import { processStreamingRows } from '../misc/process-streaming-rows';

export async function doPostSuspend(user: User) {
	await unFollowAll(user).catch(e => {});
	await readAllNotify(user).catch(e => {});
	await sendDeleteActivity(user).catch(e => {});
}

export async function sendDeleteActivity(user: User) {
	if (Users.isLocalUser(user)) {
		// 知り得る全SharedInboxにDelete配信
		const content = renderActivity(renderDelete(`${config.url}/users/${user.id}`, user));

		const query = Followings.createQueryBuilder('following')
			.select('distinct coalesce(following.followerSharedInbox, following.followeeSharedInbox) as inbox')
			.where(new Brackets((qb) =>
				qb.where({ followerHost: Not(IsNull()) })
				.orWhere({ followeeHost: Not(IsNull()) })
			))
			.andWhere(new Brackets((qb) => 
				qb.where({ followerSharedInbox: Not(IsNull()) })
				.orWhere({ followeeSharedInbox: Not(IsNull()) })
			));

		/* streamingしない版
		for (const row of await query.getRawMany()) {
			deliver(user as any, content, row.inbox);
		}
		*/

		await processStreamingRows(query, async (row: Record<string, unknown>) => {
			if (typeof row.inbox === 'string') {
				try {
					await deliver(user as any, content, row.inbox);
				} catch (e) {
					console.warn(`deliver error ${e}`);
				}
			} else {
				console.warn(`invalid row.inbox`);
			}
		});
	}
}

async function unFollowAll(follower: User) {
	const followings = await Followings.find({
		followerId: follower.id
	});

	for (const following of followings) {
		const followee = await Users.findOne({
			id: following.followeeId
		});

		if (followee == null) {
			throw `Cant find followee ${following.followeeId}`;
		}

		await deleteFollowing(follower, followee, true);
	}
}

async function readAllNotify(notifier: User) {
	await Notifications.update({
		notifierId: notifier.id,
		isRead: false,
	}, {
		isRead: true
	});
}
