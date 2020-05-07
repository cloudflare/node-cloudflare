/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const prototypal = require('es-class');
const auto = require('autocreate');

const Resource = require('../Resource');
const method = require('../method');

/**
 * Stream represents the /accout/:id/stream API endpoint.
 *
 * @class Stream
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts/:accountId/stream',
    hasBrokenPatch: true,

    includeBasic: ['browse', 'read', 'edit', 'add', 'del'],

    /**
     * ListVideos retrieves all of a account's videos.
     *
     * @function listVideos
     * @memberof Stream
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @returns {Promise<Object>} The response object
     */
    listVideos: method({
      method: 'GET',
    }),

    /**
     * VideoDetails retrieves details of a account's single video.
     *
     * @function videoDetails
     * @memberof Stream
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The video ID
     * @returns {Promise<Object>} The response object
     */
    videoDetails: method({
      method: 'GET',
      path: ':id',
    }),

    /**
     * UploadVideoFromUrl uploads a video from specific URL
     *
     * @function uploadVideoFromUrl
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {Object} video - The upload video info
     * @returns {Promise<Object>} The response object
     */
    uploadVideoFromUrl: method({
      method: 'POST',
      path: 'copy',
    }),

    /**
     * DeleteVideo deletes a account's single video.
     *
     * @function deleteVideo
     * @memberof Stream
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The video ID
     * @returns {Promise<Object>} The response object
     */
    deleteVideo: method({
      method: 'DELETE',
      path: ':id',
    }),
  })
);
