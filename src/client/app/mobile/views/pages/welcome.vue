<template>
<div class="wgwfgvvimdjvhjfwxropcwksnzftjqes">
	<div class="banner" :style="{ backgroundImage: banner ? `url(${banner})` : null }"></div>

	<div>
		<img svg-inline src="../../../../assets/title.svg" alt="Misskey">
		<p class="host">{{ host }}</p>
		<div class="about">
			<h2>{{ name || 'Misskey' }}</h2>
			<p v-html="description || this.$t('@.about')"></p>
			<router-link class="signup" to="/signup">{{ $t('@.signup') }}</router-link>
			<div class="signin">
				<a href="/signin" @click.prevent="signin()">{{ $t('@.signin') }}</a>
			</div>
			<div class="explore" v-if="meta && !(meta.authorizedProfileDirectory || meta.disableProfileDirectory)">
				<router-link class="explore" to="/explore">{{ $t('@.explore') }}</router-link>
			</div>
		</div>
		<div class="announcements" v-if="announcements && announcements.length > 0">
			<article v-for="announcement in announcements">
				<span class="title" v-html="announcement.title"></span>
				<div>
					<mfm :text="announcement.text"/>
					<img v-if="announcement.image" :src="announcement.image" alt="" style="display: block; max-height: 120px; max-width: 100%;"/>
				</div>
			</article>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import { host } from '../../../config';
import { concat } from '../../../../../prelude/array';
import { toUnicode } from 'punycode/';

export default Vue.extend({
	i18n: i18n('mobile/views/pages/welcome.vue'),
	data() {
		return {
			meta: null,
			stats: null,
			banner: null,
			host: toUnicode(host),
			name: null,
			description: '',
			announcements: []
		};
	},
	created() {
		this.$root.getMeta().then(meta => {
			this.meta = meta;
			this.name = meta.name;
			this.description = meta.description;
			this.announcements = meta.announcements;
			this.banner = meta.bannerUrl;
		});

		this.$root.api('stats').then(stats => {
			this.stats = stats;
		});
	},
	methods: {
		signin() {
			this.$root.dialog({
				type: 'signin'
			});
		}
	}
});
</script>

<style lang="stylus" scoped>
.wgwfgvvimdjvhjfwxropcwksnzftjqes
	text-align center

	> .banner
		position absolute
		top 0
		left 0
		width 100%
		height 300px
		background-position center
		background-size cover
		opacity 0.7

		&:after
			content ""
			display block
			position absolute
			bottom 0
			left 0
			width 100%
			height 100px
			background linear-gradient(transparent, var(--bg))

	> div:not(.banner)
		padding 32px
		margin 0 auto
		max-width 500px

		> svg
			display block
			width 200px
			height 50px
			margin 0 auto

		> .host
			display block
			text-align center
			padding 6px 12px
			line-height 32px
			font-weight bold
			color #333
			background rgba(#000, 0.035)
			border-radius 6px

		> .about
			margin-top 16px
			padding 16px
			color var(--text)
			background var(--face)
			border-radius 6px

			> h2
				margin 0

			> p
				margin 8px

			> .signup
			> .signin
			> .explore
				margin 0.5em

		> .announcements
			margin 16px 0

			> article
				background var(--mobileAnnouncement)
				border-radius 6px
				color var(--mobileAnnouncementFg)
				padding 16px
				margin 8px 0
				font-size 12px

				> .title
					font-weight bold

		> .about-misskey
			margin 16px 0
			padding 32px
			font-size 14px
			background var(--face)
			border-radius 6px
			overflow hidden
			color var(--text)

			> h1
				margin 0

				& + p
					margin-top 8px

			> p:last-child
				margin-bottom 0

			> section
				> h2
					border-bottom 1px solid var(--faceDivider)

				> section
					margin-bottom 16px
					padding-bottom 16px
					border-bottom 1px solid var(--faceDivider)

					> h3
						margin-bottom 8px

					> p
						margin-bottom 0

					> .image
						> img
							display block
							width 100%
							height 120px
							object-fit cover

		> footer
			text-align center
			color var(--text)

			> small
				display block
				margin 16px 0 0 0
				opacity 0.7

</style>
