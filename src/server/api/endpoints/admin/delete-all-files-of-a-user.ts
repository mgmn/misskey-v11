import $ from 'cafy';
import define from '../../define';
import { Users } from '../../../../models';
import { insertModerationLog } from '../../../../services/insert-moderation-log';
import { ID } from '../../../../misc/cafy-id';
import { createDeleteDriveFilesJob } from '../../../../queue';

export const meta = {
	tags: ['admin'],

	requireCredential: true,
	requireModerator: true,

	params: {
		userId: {
			validator: $.type(ID),
			desc: {
				'ja-JP': '対象のユーザーID',
				'en-US': 'The user ID which you want to suspend'
			}
		},
	}
};

export default define(meta, async (ps, me) => {
	const user = await Users.findOne(ps.userId as string);

	if (user == null) {
		throw new Error('user not found');
	}

	insertModerationLog(me, 'deleteAllFiles', {
		targetId: user.id,
	});

	createDeleteDriveFilesJob(user)
});
