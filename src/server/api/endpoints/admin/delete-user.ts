import $ from 'cafy';
import { ID } from '../../../../misc/cafy-id';
import define from '../../define';
import { Users, Signins } from '../../../../models';
import { insertModerationLog } from '../../../../services/insert-moderation-log';
import { doPostSuspend } from '../../../../services/suspend-user';
import { publishTerminate } from '../../../../services/server-event';
import { createDeleteAccountJob } from '../../../../queue';

export const meta = {
	desc: {
		'ja-JP': '指定したユーザーを削除します。',
		'en-US': 'delete user'
	},

	tags: ['admin'],

	requireCredential: true,
	requireModerator: true,

	params: {
		userId: {
			validator: $.type(ID),
			desc: {
				'ja-JP': '対象のユーザーID',
				'en-US': 'The user ID which you want to delete'
			}
		},
	}
};

export default define(meta, async (ps, me) => {
	const user = await Users.findOne(ps.userId as string);

	if (user == null) {
		throw new Error('user not found');
	}

	if (user.isAdmin) {
		throw new Error('cannot delete admin');
	}

	if (user.isModerator) {
		throw new Error('cannot delete moderator');
	}

	insertModerationLog(me, 'deleteAccount', {
		targetId: user.id,
	});

	// 物理削除する前にDelete activityを送信する
	await doPostSuspend(user).catch(e => {});

	createDeleteAccountJob(user);

	await Users.update(user.id, {
		isDeleted: true,
	});

	if (user.isLocalUser) {
		// Terminate streaming
		publishTerminate(user.id);
		Signins.remove({ userId: user.id });
	}
});
